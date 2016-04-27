#!/usr/bin/env node
var yargs = require('yargs')
  .describe('state', 'The state to zoom into and render')
  .describe('width', 'The output width in pixels')
  .describe('height', 'The output height in pixels')
  .describe('counties', 'Whether to include counties')
  .boolean('counties')
  .describe('css', 'URI of a stylesheet to link')
  .describe('debug', 'Output debugging shapes')
  .boolean('debug')
  .alias('h', 'help');

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

var zerofill = function(d, len) {
  if (typeof d !== 'string') {
    d = String(d);
  }
  while (d.length < len) {
    d = '0' + d;
  }
  return d;
};

var inherit = function(selection, props) {
  selection.each(function() {
    props.forEach(function(prop) {
      this.setProperty(prop, 'inherit');
    }, this.style);
  });
};

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
      .attr('version', '1.2') // TinySVG!
      .attr('id', 'root');

    if (argv.css) {
      var css = argv.css;
      if (!Array.isArray(css)) {
        css = [css];
      }
      svg.append('style')
        .text(css.map(function(uri) {
          return '\n@import url("' + encodeURI(uri) + '");';
        }).join('\n'));
    }

    var topology = objects[0];
    if (!topology) {
      console.error('got %d objects:', objects.length);
      process.exit(1);
    }
    var states = topology.objects.states;

    var id = function(d) { return d.id; };
    var isCurrentState = function(d) {
      return d.properties.state === argv.state;
    };

    var stateFeatures = topojson.feature(topology, states).features;

    var currentState = argv.state
      ? stateFeatures.filter(function(d) {
          return d.id === argv.state;
        })[0]
      : null;

    if (currentState) {
      var bbox = path.bounds(currentState);
      // console.warn('bbox:', bbox);

      var w = Math.abs(bbox[1][0] - bbox[0][0]);
      var h = Math.abs(bbox[1][1] - bbox[0][1]);

      var left = Math.min(bbox[0][0], bbox[1][0]);
      var top = Math.min(bbox[0][1], bbox[1][1]);
      svg.attr('viewBox', [left, top, w, h].join(' '));

      if (argv.debug) {
        svg.append('rect')
          .attr('id', 'bbox')
          .attr('class', 'bbox')
          .attr('x', left)
          .attr('y', top)
          .attr('width', w)
          .attr('height', h);
      }

    } else if (argv.state) {
      console.warn('no state found:', argv.state);
    } else {
      svg.attr('viewBox', [0, 0].concat(size).join(' '));
    }

    if (!argv.state) {
      // 1. state polygons
      svg.append('g')
        .attr('id', 'states')
        .selectAll('path')
          .data(stateFeatures)
          .enter()
          .append('path')
            .attr('id', id)
            .attr('class', 'state feature')
            .attr('d', path);
    }

    // 2. county polygons
    if (argv.counties) {
      var counties = topology.objects.counties;
      var countyFeatures = topojson.feature(topology, counties).features;
      if (currentState) {
        counties.geometries = counties.geometries.filter(isCurrentState);
        countyFeatures = countyFeatures.filter(isCurrentState);
      }

      svg.append('g')
        .attr('id', 'counties')
        .selectAll('path')
          .data(countyFeatures)
          .enter()
          .append('path')
            .attr('id', function(d, i) {
              return 'county-' + zerofill(d.id, 5);
            })
            .attr('class', 'county feature')
            .attr('d', path)
            .append('title')
              .text(function(d) {
                return d.properties.name;
              });
    }

    // TODO: land ownership

    // county boundaries (mesh)
    if (argv.counties) {
      var countyMesh = topojson.mesh(topology, counties);
      svg.append('path')
        .datum(countyMesh)
        .attr('id', 'counties-mesh')
        .attr('class', 'counties mesh')
        .attr('d', path);
    }

    if (!argv.state) {
      // state boundaries (mesh)
      var stateMesh = topojson.mesh(topology, states);
      svg.append('path')
        .datum(stateMesh)
        .attr('id', 'states-mesh')
        .attr('class', 'states mesh')
        .attr('d', path);
    }

    // ensure that all paths inherit fill and stroke styles, and get
    // non-scaling strokes
    svg.selectAll('path')
      .call(inherit, ['fill', 'stroke', 'stroke-width'])
      .attr('vector-effect', 'non-scaling-stroke');

    next(null, svg.property('outerHTML'));
  }, done);
};

var writeSVG = function(svg, done) {
  var out = argv.o
    ? fs.createWriteStream(argv.o)
    : process.stdout;
  out.write('<?xml version="1.0" standalone="yes"?>' + os.EOL);
  /*
  if (argv.css) {
    var uris = argv.css;
    if (!Array.isArray(uris)) {
      uris = [uris];
    }
    uris.forEach(function(uri) {
      out.write('<?xml-stylesheet type="text/css" href="' + encodeURI(uri) + '"?>' + os.EOL);
    });
  }
  */
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
