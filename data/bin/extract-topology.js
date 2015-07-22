#!/usr/bin/env node
var yargs = require('yargs')
  // .demand(1)
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
var topojsonOptions = require('../../lib/topojson-options')(options);

var args = options._;
fs.readFile(args[0] || '/dev/stdin', function(error, buffer) {
  if (error) return console.error('error:', error);
  var topology = JSON.parse(buffer.toString());

  var objects = {};
  for (var key in topology.objects) {
    if (options.layer === key || (Array.isArray(options.layer) && options.layer.indexOf(key) > -1)) {
      objects[key] = topology.objects[key];
    }
  }

  topology.objects = objects;
  topojson.prune(topology);

  fs.createWriteStream(options.o)
    .write(JSON.stringify(topology));
});

