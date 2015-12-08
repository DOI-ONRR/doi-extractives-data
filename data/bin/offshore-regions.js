#!/usr/bin/env node
var yargs = require('yargs');
var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var topojson = require('topojson');
var topojsonOptions = require('../../lib/topojson-options')();

var args = options._;

fs.readFile(args[0] || '/dev/stdin', function(error, buffer) {
  if (error) {
    return console.error('error:', error);
  }

  var topology = JSON.parse(buffer.toString());
  var objects = {};

  var regions = Object.keys(topology.objects)
    .map(function(key) {
      var obj = topology.objects[key];
      objects[key] = topojson.feature(topology, obj);
      var region = topojson.merge(topology, obj.geometries);
      region.id = key;
      region.properties = {
        name: obj.geometries[0].properties.region
      };
      return region;
    });

  objects.regions = {
    type: 'GeometryCollection',
    geometries: regions
  };

  var out = topojson.topology(objects, topojsonOptions);
  fs.writeFile(args[1] || '/dev/stdout', JSON.stringify(out), function(error) {
    if (error) console.error(error);
  });

});
