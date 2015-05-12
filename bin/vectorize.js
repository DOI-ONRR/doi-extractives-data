#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] a.json b.json')
  .describe('proj', 'the d3 geo projection (default: custom Albers USA)')
  .describe('center', 'projection center in the form "lon,lat"')
  .describe('scale', 'projection scale as a float')
  .describe('translate', 'projection translation in the form "x,y"')
  .describe('width', 'the SVG width in pixels')
  .default('width', 960)
  .describe('height', 'the SVG height in pixels')
  .default('height', 650)
  .describe('graticule', 'draw a graticule for debugging purposes')
  .boolean('graticule')
  .alias('graticule', 'g')
  .describe('p0', 'draw a circle at the first point in each topology (for debugging)')
  .boolean('p0')
  .describe('o', 'write the SVG to this file')
  .default('o', '/dev/stdout')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var rw = require('rw');
var util = require('../lib/util');
var async = require('async');
var d3 = require('d3');
var topojson = require('topojson');
var jsdom = require('jsdom');
var albersCustom = require('../lib/albers-custom');

var scripts = [];

async.waterfall([
  function loadFiles(done) {
    async.map(options._, function load(filename, next) {
      util.readJSON(filename, function(error, data) {
        if (error) return done(error);
        data.filename = filename;
        return next(null, data);
      });
    }, done);
  },
  function render(objects, done) {
    jsdom.env('<svg></svg>', scripts, function(errors, window) {
      if (errors) return console.error('error:', errors[0]);

      var proj = options.proj
        ? d3.geo[options.proj]()
        : albersCustom();
      if (options.center) {
        var center = coord(options.center);
        proj.center(center);
      }
      if (options.scale) {
        proj.scale(options.scale * proj.scale());
      }
      if (options.translate) {
        var translate = coord(options.translate);
        proj.translate(translate);
      }

      var path = d3.geo.path()
        .projection(proj);

      var size = proj.size
        ? proj.size()
        : [options.width, options.height];

      var svg = d3.select(window.document.querySelector('svg'))
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', size[0])
        .attr('height', size[1]);

      var style = svg.append('style')
        .attr('type', 'text/css')
        .text([
          '',
          'path { fill: none; stroke: #ccc; stroke-width: .5; vector-effect: non-scaling-stroke; }',
          '#states path { stroke: #999; stroke-width: .5; }',
          '#USA path { stroke: #eee; stroke-width: 1; }',
          '#alaska path, #atlantic path, #gulf path, #pacific path { stroke: #69c; }',
          '',
        ].join('\n'));

      var bbox;

      var g = svg.selectAll('g.file')
        .data(objects)
        .enter()
        .append('g')
          .attr('class', 'file')
          .attr('data-filename', function(d) {
            return d.filename;
          });

      var topo = g.filter(function(d) {
        return d.type === 'Topology';
      });

      topo.selectAll('path.feature')
        .data(function(topology) {
          return Object.keys(topology.objects)
            .reduce(function(features, key) {
              var collection = topojson.feature(topology, topology.objects[key]);
              return features.concat(collection.features);
            }, []);
        })
        .enter()
        .append('path')
          .attr('class', 'feature')
          .attr('d', path);

      topo = topo.selectAll('g.layer')
        .data(function(topology) {
          if (topology.bbox) bbox = topology.bbox;
          return d3.entries(topology.objects)
            .map(function(d) {
              var mesh = topojson.mesh(topology, d.value);
              mesh.id = d.key;
              return mesh;
            });
        })
        .enter()
        .append('g')
          .attr('class', 'layer topojson')
          .attr('id', function(d) { return d.id; });

      topo.append('path')
        .attr('class', 'mesh')
        .attr('d', function(d) {
          return path(d);
        });

      if (options.p0) {
        var p0;
        topo.selectAll('circle.p0')
          .data(function(d) {
            return d.coordinates.map(function(c) {
              return c[0];
            });
          })
          .enter()
          .append('circle')
            .attr('r', 1)
            .attr('class', 'p0')
            .attr('transform', function(c) {
              if (p0) return;
              return 'translate(' + proj(p0 = c) + ')';
            });
      }

      g.filter(function(d) {
          return d.type === 'FeatureCollection';
        })
        .append('g')
          .attr('class', 'collection')
          .attr('id', function(d) {
            return d.filename;
          });

      g.selectAll('g.collection')
        .selectAll('path.feature')
        .data(function(d) {
          return d.features;
        })
        .enter()
        .append('path')
          .attr('class', 'feature')
          .attr('id', function(d) { return d.id; })
          .attr('d', path);

      if (options.graticule) {
        var graticule = d3.geo.graticule();
        svg.append('path')
          .attr('class', 'graticule')
          .attr('d', path(graticule()))
          .attr('fill', 'none')
          .attr('stroke-dasharray', '2 2');
      }

      /*
      if (bbox) {
        var bounds = path.bounds(bbox);
        // console.warn('bbox:', bbox, '->', bounds);
        var validBounds = bounds.every(function(c) {
          return c.every(isFinite);
        });
        if (validBounds) {
          svg.attr('viewBox', [
            bounds[0][0],
            bounds[0][1],
            bounds[1][0] - bounds[0][0],
            bounds[1][1] - bounds[0][1]
          ].join(' '));
        }
      }
      */

      var out = rw.fileWriter(options.o);
      out.write('<?xml version="1.0" standalone="yes"?>\n');
      out.write(svg.property('outerHTML'));
      out.end();
      done();
    });
  }
], function(error) {
  if (error) return console.error('error:', error);
});

function coord(str) {
  return str.split(',').map(Number);
}
