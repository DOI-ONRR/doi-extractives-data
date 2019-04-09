#!/usr/bin/env node
var albersCustom = require('../../lib/albers-custom');

var yargs = require('yargs')
  .describe('scale', 'Uniform (width and height) scale')
  .alias('h', 'help');

var argv = yargs.argv;

if (argv.help) {
  return yargs.showHelp();
}

var async = require('async');
var Canvas = require('canvas');
var Image = Canvas.Image;
var d3 = require('d3');
var fs = require('fs');
var os = require('os');
var topojson = require('topojson');
var util = require('../../lib/util');
var vectorize = require('../lib/vectorize');

var proj = argv.proj
  ? d3.geo[argv.proj]()
  : albersCustom();

var size = (typeof proj.size === 'function')
  ? proj.size()
  : [argv.width, argv.height];

var path = d3.geo.path()
  .projection(proj);

var inherit = function(selection, props) {
  selection.each(function() {
    props.forEach(function(prop) {
      this.setProperty(prop, 'inherit');
    }, this.style);
  });
};

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

  var size = proj.size();
  var scale = argv.scale || 1;
  var canvas = new Canvas(size[0] * scale, size[1] * scale);
  var ctx = canvas.getContext('2d');

  var dropped = 0;
  var transform = d3.geo.transform({
      point: function(x, y) {
        var p = proj([x, y]);
        if (p) {
          this.stream.point(p[0] * scale, p[1] * scale);
        } else {
          dropped++;
        }
      }
    });

  path.projection(transform);
  path.context(ctx);

  ctx.lineWidth = 0.5;
  ctx.fillStyle = ctx.strokeStyle = '#000';

  objects.forEach(function(topology) {
    console.warn('drawing topology:', topology.filename);
    Object.keys(topology.objects).forEach(function(name) {
      console.warn('drawing objects:', name);
      var object = topology.objects[name];
      var features = topojson.feature(topology, object).features;

      features.forEach(function(d) {
        ctx.beginPath();
        path(d);
        ctx.closePath();
        ctx.fill('evenodd');
        ctx.stroke();
      });
    });
  });

  if (dropped) {
    console.warn('dropped %d points', dropped);
  }

  var out = argv.o
    ? fs.createWriteStream(argv.o)
    : process.stdout;

  canvas.pngStream()
    .pipe(out)
    .on('end', done);
};

async.waterfall([
  load,
  render,
], function(error) {
  if (error) {
    console.error('error:', error);
  }
});
