#!/usr/bin/env node
var yargs = require('yargs')
  // .demand(1)
  .describe('layer', 'the layer name in topology.objects')
  .describe('filter', 'filter features by this data expression')
  .describe('of', 'output format')
  .default('of', 'ndjson')
  .describe('o', 'write to this file')
  .default('o', '/dev/stdout')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help || !options.layer) {
  return yargs.showHelp();
}

var fs = require('fs');
var topojson = require('topojson');
var datex = require('data-expression');
var streamify = require('stream-array');
var tito = require('tito');

var args = options._;
fs.readFile(args[0] || '/dev/stdin', function(error, buffer) {
  if (error) return console.error('error:', error);
  var topology = JSON.parse(buffer.toString());

  var props = [];
  for (var key in topology.objects) {
    if (options.layer === key || (Array.isArray(options.layer) && options.layer.indexOf(key) > -1)) {
      var features = topojson.feature(topology, topology.objects[key]).features;
      props = props.concat(features.map(function(f) {
        if (!f.properties.id) f.properties.id = f.id;
        return f.properties;
      }));
    }
  }

  streamify(props)
    .pipe(tito.formats.createWriteStream(options.of))
    .pipe(fs.createWriteStream(args[1] || '/dev/stdout'));
});

