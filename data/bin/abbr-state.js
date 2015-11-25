#!/usr/bin/env node
var yargs = require('yargs')
  .describe('states', 'a comma-separated values file containing state data')
  .default('states', 'input/geo/states.csv')
  .describe('if', 'input format')
  .default('if', 'ndjson')
  .describe('of', 'output format')
  .default('of', 'ndjson')
  .describe('field', 'the name of the data field (CSV column) to update')
  .default('field', 'State')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var args = options._;

var fs = require('fs');
var tito = require('tito').formats;
var thru = require('through2').obj;
var statesByName = {};

var statesFilename = options.states;
if (!statesFilename) {
  return console.error('You must provide --states or a filename as a positional argument');
}

var otherAbbrs = {
  'United States': 'US',
  'District of Columbia': 'DC'
};

fs.createReadStream(statesFilename)
  .pipe(tito.createReadStream('csv'))
  .pipe(thru(function(d, enc, next) {
    // console.warn('state:', d);
    statesByName[d.name] = d;
    next();
  }))
  .on('finish', read);

function read() {
  var field = options.field;
  fs.createReadStream(args[0] || '/dev/stdin')
    .pipe(tito.createReadStream(options['if']))
    .pipe(thru(function(d, enc, next) {
      var name = d[field];
      var state = statesByName[name];
      if (state) {
        d[field] = state.abbr;
        next(null, d);
      } else if (name in otherAbbrs) {
        d[field] = otherAbbrs[name];
        next(null, d);
      } else {
        console.warn('no such state:', name);
        next();
      }
    }))
    .pipe(tito.createWriteStream(options['of']))
    .pipe(process.stdout);
}
