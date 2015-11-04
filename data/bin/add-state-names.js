#!/usr/bin/env node
var yargs = require('yargs')
  .describe('states', 'a comma-separated values file containing state data')
  .default('states', 'input/geo/states.csv')
  .describe('field', 'the name of the GeoJSON property to update')
  .default('field', 'name')
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
var topojson = require('topojson');
var abbrToName = {};

fs.createReadStream(options.states)
  .pipe(tito.createReadStream('csv'))
  .pipe(thru(function(d, enc, next) {
    // console.warn('state:', d);
    abbrToName[d.abbr] = d.name;
    next();
  }))
  .on('finish', update);

function update() {
  var filename = args[0];
  if (!filename) {
    console.error('you must supply a topojson filename');
    process.exit(1);
  }

  var topology = JSON.parse(fs.readFileSync(filename));
  topology.objects.states.geometries.forEach(function(g) {
    g.properties.name = abbrToName[g.properties.abbr];
  });

  fs.writeFile(filename, JSON.stringify(topology), 'utf8', function(error) {
    if (error) {
      console.error('unable to write %s: %s', filename, error);
      process.exit(1);
    }
  });
}
