#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] a.json b.json')
  .describe('proj', 'the d3 geo projection')
  .default('proj', 'albersUsa')
  .describe('width', 'the SVG width in pixels')
  .default('width', 920)
  .describe('height', 'the SVG height in pixels')
  .default('height', 500)
  .describe('o', 'write the SVG to this file')
  .default('o', '/dev/stdout')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var async = require('async');
var d3 = require('d3');
var topojson = require('topojson');
var jsdom = require('jsdom');

var scripts = [];

var out = fs.createWriteStream(options.o);

async.waterfall([
  function loadFiles(done) {
    async.map(options._, function load(filename, next) {
      fs.readFile(filename, function(error, buffer) {
	if (error) return done(error);
	var data = JSON.parse(buffer.toString());
	data.filename = filename;
	return next(null, data);
      });
    }, done);
  },
  function render(objects, done) {
    jsdom.env('<svg></svg>', scripts, function(errors, window) {
      if (errors) return console.error('error:', errors[0]);

      var svg = d3.select(window.document.querySelector('svg'))
	.attr('width', options.width)
	.attr('height', options.height)
	.attr('xmlns', 'http://www.w3.org/2000/svg');

      var style = svg.append('style')
	.attr('type', 'text/css')
	.text([
	  '',
	  'path { fill: none; stroke: #ccc; stroke-width: .5; vector-effect: non-scaling-stroke; }',
	  '#states path { stroke: #999; stroke-width: 1; }',
	  '#USA path { stroke: #eee; stroke-width: 2; }',
	  '',
	].join('\n'));

      var proj = d3.geo[options.proj]();
      var path = d3.geo.path()
	.projection(proj);

      var g = svg.selectAll('g.file')
	.data(objects)
	.enter()
	.append('g')
	  .attr('class', 'file')
	  .attr('data-filename', function(d) {
	    return d.filename;
	  });

      g.filter(function(d) {
	  return d.type === 'Topology';
	})
	.selectAll('g.layer')
	  .data(function(topology) {
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
	    .attr('id', function(d) { return d.id; })
	    .append('path')
	      .attr('class', 'mesh')
	      .attr('d', function(d) {
		return path(d);
	      });

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

      out.write('<?xml version="1.0" standalone="yes"?>\n');
      out.write(svg.property('outerHTML'));
      done();
    });
  }
], function(error, buffer) {
  if (error) return console.error('error:', error);
  // out.close();
});
