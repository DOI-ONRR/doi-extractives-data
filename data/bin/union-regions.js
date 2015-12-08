#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options]')
  .describe('onshore', 'The path of the onshore (state) data')
  .describe('offshore', 'The path of the offshore area data')
  .describe('if', 'input format')
  .default('if', 'tsv')
  .describe('of', 'output format')
  .default('of', 'tsv')
  .alias('h', 'help')
  .wrap(120);
var options = yargs.argv;

if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var tito = require('tito').formats;
var async = require('async');
var d3 = require('d3');
var util = require('../../lib/util');
var read = util.readData;
var streamify = require('stream-array');

async.parallel({
  onshore: function readOnshore(done) {
    return read(
      options.onshore,
      tito.createReadStream(options['if']),
      done
    );
  },
  /*
  states: function readStates(done) {
    var format = options.states.split('.').pop();
    return read(
      options.states,
      tito.createReadStream(format),
      done
    );
  },
  */
  offshore: function readOffshore(done) {
    return read(
      options.offshore,
      tito.createReadStream(options['if']),
      done
    );
  },
  offshoreAreas: function readRegions(done) {
    var format = options.areas.split('.').pop();
    return read(
      options.areas,
      tito.createReadStream(format),
      done
    );
  }
}, function(error, data) {
  if (error) return console.error(error);

  /*
  var stateAbbrByName = d3.nest()
    .key(util.getter('name'))
    .rollup(function(d) { return d[0].abbr; })
    .map(data.states);
  */

  var areaIdByName = d3.nest()
    .key(util.getter('name'))
    .rollup(function(d) { return d[0].id; })
    .map(data.offshoreAreas);

  var results = data.onshore
    .map(function(d) {
      d.Region = d.State;
      delete d.State;
      return d;
    })
    .concat(data.offshore.map(function(d) {
      var area = d.Area || d.Region;
      var region = areaIdByName[area];
      d.Region = region;
      delete d.Area;
      return d;
    }));

  if (false) {
    results = results.filter(function(d) {
      return d.Region;
    });
  }

  streamify(results)
    .pipe(tito.createWriteStream(options['of']))
    .pipe(process.stdout);

});
