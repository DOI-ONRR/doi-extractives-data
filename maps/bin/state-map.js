#!/usr/bin/env node
var yargs = require('yargs')
  .describe('state', 'The state to zoom into and render')
  .describe('width', 'The output width in pixels')
  .describe('height', 'The output height in pixels')
  .describe('gutter', 'Gutter around the selected state, in pixels')
  .default('gutter', 20)
  .describe('counties', 'Whether to include counties')
  .boolean('counties');

var argv = yargs.argv;

if (argv.help) {
  return yargs.showHelp();
}

var async = require('async');
var d3 = require('d3');
var fs = require('fs');
var jsdom = require('jsdom');
var os = require('os');
var topojson = require('topojson');
var util = require('../../lib/util');
var vectorize = require('../lib/vectorize');

var albersCustom = require('../../lib/albers-custom');
var proj = argv.proj
  ? d3.geo[argv.proj]()
  : albersCustom();

var size = (typeof proj.size === 'function')
  ? proj.size()
  : [argv.width, argv.height];

var path = d3.geo.path()
  .projection(proj);

var scripts = [];

var load = function(done) {
  async.map(argv._, function load(filename, next) {
    util.readJSON(filename, function(error, data) {
      if (error) {
        return done(error);
      }
      data.filename = filename;
      return next(null, data);
    });
  }, done);
};

var render = function(objects, done) {
  vectorize(function(svg, next) {
    svg = d3.select(svg)
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('width', size[0])
      .attr('height', size[1]);

    var topology = objects[0];
    var states = topology.objects.states;
    var counties = topology.objects.counties;

    var id = function(d) { return d.id; };

    var stateFeatures = topojson.feature(topology, states).features;

    var currentState = stateFeatures.filter(function(d) {
      return d.id === argv.state;
    })[0];

    if (currentState) {
      var bbox = path.bounds(currentState);
      // console.warn('bbox:', bbox);

      var w = bbox[1][0] - bbox[0][0];
      var h = bbox[1][1] - bbox[0][1];

      if (argv.gutter) {
        var scale = Math.max(w, h) / Math.min(size[0], size[1]);
        var gutter = argv.gutter * scale;
        bbox[0][0] -= gutter;
        bbox[0][1] -= gutter;
        bbox[1][0] += gutter;
        bbox[1][1] += gutter;
        w += gutter * 2;
        h += gutter * 2;
      }

      svg.attr('viewBox', [
        bbox[0][0],
        bbox[0][1],
        w, h
      ].join(' '));

      var extent = proj.invert(bbox[0])
        .concat(proj.invert(bbox[1]));
      // console.warn('clip extent:', extent);

      var clip = d3.geo.clipExtent(extent);
      path.projection({
        stream: function(s) {
          return proj.stream(clip.stream(s));
        }
      });

    } else {
      console.warn('no state found:', argv.state);
    }

    // 1. state polygons
    svg.append('g')
      .attr('id', 'states')
      .selectAll('path')
        .data(stateFeatures)
        .enter()
        .append('path')
          .attr('id', id)
          .attr('class', 'state')
          .attr('d', path);

    // 2. county polygons
    if (argv.counties) {
      var countyFeatures = topojson.feature(topology, counties).features;
      if (argv.state) {
        countyFeatures = countyFeatures
          .filter(function(d) {
            return d.properties.state === argv.state;
          });
      }
      svg.append('g')
        .attr('id', 'counties')
        .selectAll('path')
          .data(countyFeatures)
          .enter()
          .append('path')
            .attr('id', id)
            .attr('class', 'county')
            .attr('d', path);
    }

    // TODO: land ownership

    // county boundaries (mesh)
    if (argv.counties) {
      var countyMesh = topojson.mesh(topology, counties);
      svg.append('path')
        .attr('id', 'counties-mesh')
        .attr('class', 'counties mesh')
        .attr('d', path);
    }

    // state boundaries (mesh)
    var stateMesh = topojson.mesh(topology, states);
    svg.append('path')
      .attr('id', 'states-mesh')
      .attr('class', 'states mesh')
      .attr('d', path);

    next(null, svg.property('outerHTML'));
  }, done);
};

var writeSVG = function(svg, done) {
  var out = argv.o
    ? fs.createWriteStream(argv.o)
    : process.stdout;
  out.write('<?xml version="1.0" standalone="yes"?>' + os.EOL);
  out.write(svg);
  if (out !== process.stdout) {
    out.end();
  }
  done();
};

async.waterfall([
  load,
  render,
  writeSVG
], function(error) {
  if (error) {
    console.error('error:', error);
  }
});
