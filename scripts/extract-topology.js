#!/usr/bin/env node
var yargs = require('yargs')
  .demand(1)
  .describe('layer', 'the layer name in topology.objects')
  .describe('filter', 'filter features by this data expression')
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
var topojsonOptions = require('../lib/topojson-options')(options);

var args = options._;
fs.readFile(args[0], function(error, buffer) {
  if (error) return console.error('error:', error);
  var topology = JSON.parse(buffer.toString());
  var collection = topojson.feature(topology, topology.objects[options.layer]);
  var features = collection.features;
  if (options.filter) {
    var filter = datex(options.filter);
    features = features.filter(filter);
    if (!features.length) {
      console.error('No features matched filter: "%s", options.filter');
      process.exit(1);
    }
  }

  var layers = {};
  layers[options.layer] = {
    type: 'FeatureCollection',
    features: features
  };

  var result = topojson.topology(layers, topojsonOptions);

  fs.createWriteStream(options.o)
    .write(JSON.stringify(result));
});

