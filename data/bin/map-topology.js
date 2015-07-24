#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] --props.foo "{x: y}" topology.json')
  .demand(1)
  .describe('keep', 'keep this layer')
  .describe('o', 'write the resulting topology to this file')
  .default('o', '/dev/stdout')
  .alias('h', 'help')
  .wrap(100);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var datex = require('data-expression');
var topojson = require('topojson');
var util = require('../../lib/util');

var props = {};
if (typeof options.props === 'object') {
  props = options.props;
}

var filters = {};
if (typeof options.filter === 'object') {
  filters = options.filter;
}

var id = {};
if (typeof options.id === 'object') {
  id = options.id;
}

var keep = options.keep;
if (keep && keep !== true && !Array.isArray(keep)) {
  keep = [keep];
}

var keepLayer = function(layer) {
  return keep === true || (keep && keep.indexOf(layer) > -1);
};

util.readJSON(options._[0], function(error, topology) {
  var layers = [];
  for (var layer in topology.objects) {
    var objects = topology.objects[layer];
    var geoms = objects.geometries;
    var pmap = props[layer];
    if (pmap === true || keepLayer(layer)) {
      // do nothing
      console.warn('preserving layer: "%s"', layer);
    } else if (pmap) {
      console.warn('mapping layer properties: "%s" -> `%s`', layer, pmap);
      var expr = datex.map(pmap);
      geoms.forEach(function(d) {
        expr.set('this', d);
        var props = d.properties;
        d.properties = expr(props);
        if (id[layer]) {
          d.id = datex(id[layer], d.properties);
        }
        console.warn(props, '->', d.id, d.properties);
      });
    } else {
      console.warn('removing layer: "%s"', layer);
      delete topology.objects[layer];
    }

    var filter = filters[layer];
    if (filter) {
      var expr = datex(filter);
      objects.geometries = geoms.filter(function(d) {
        expr.set('this', d);
        return expr(d.properties);
      });
      var diff = geoms.length - objects.geometries.length;
      if (diff > 0) {
        console.warn('filtered %d features in layer "%s"', diff, layer);
      }
    }
  }

  topojson.prune(topology, {'verbose': true});

  fs.createWriteStream(options.o)
    .write(JSON.stringify(topology));
});
