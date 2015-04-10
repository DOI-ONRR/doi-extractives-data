#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options]')
  .describe('in-topo', 'input TopoJSON (assumed to be US counties)')
  .default('in-topo', 'input/geo/us-counties.json')
  .describe('in-counties', 'county revenues data (tab-separated)')
  .default('in-counties', 'input/county-revenues.tsv')
  .describe('in-states', 'states data CSV w/abbr, FIPS and name fields')
  .default('in-states', 'input/geo/states.csv')
  .describe('out-topo', 'output TopoJSON (with counties and states) to this file')
  .default('out-topo', 'us-topology.json')
  .describe('inner', 'only include geometries for counties with data')
  .boolean('inner')
  .alias('in-topo', 'it')
  .alias('in-counties', 'ir')
  .alias('in-states', 'is')
  .alias('out-topo', 'ot')
  .alias('h', 'help')
  .wrap(120);
var options = yargs.argv;

if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var tito = require('tito').formats;
var async = require('async');
var topojson = require('topojson');
var topojsonOptions = require('../lib/topojson-options')(options);
var d3 = require('d3');
var util = require('../lib/util');
var assert = require('assert');
var streamify = require('stream-array');
var thru = require('through2').obj;

var read = util.readData;
var map = util.map;
var get = util.getter;

async.parallel({
  states: function readStates(done) {
    return read(
      options['in-states'],
      tito.createReadStream('csv'),
      done
    );
  },
  revenues: options.inner
    ? function readRevenues(done) {
      return read(
	options['in-counties'],
	tito.createReadStream('tsv'),
	done
      );
    }
    : noop,
  counties: function readCounties(done) {
    fs.readFile(options['in-topo'], function(error, buffer) {
      return error
	? done(error)
	: done(null, JSON.parse(buffer.toString()));
    });
  }
}, function(error, data) {
  if (error) return console.error('error:', error);

  var revenues = data.revenues;
  var states = data.states;
  var topology = data.counties;

  var statesByAbbr = map(states, 'abbr', true);

  // turn them into GeoJSON features
  var counties = topology.objects.counties.geometries;
  var countyFeatures = topojson.feature(topology, topology.objects.counties).features;

  // group counties by state to infer states
  var countiesByState = d3.nest()
    .key(function(d) {
      return d.properties.state;
    })
    .entries(counties);

  // American Samoa, Puerto Rico, Guam and Virgin Islands
  var territories = d3.set(['AS', 'PR', 'GU', 'VI']);

  var stateFeatures = countiesByState
    // filter out territories
    .filter(function(d) {
      return !territories.has(d.key);
    })
    // merge counties into states
    .map(function(d) {
      var abbr = d.key;
      var geom = topojson.merge(topology, d.values);
      return {
        id: abbr,
        properties: statesByAbbr[abbr],
        geometry: geom
      };
    });

  assert.equal(stateFeatures.length, 51);

  // fix the FIPS ids, because some numbers lack the 0 prefix
  countyFeatures.forEach(function(d) {
    d.id = d.properties.FIPS;
  });

  if (options.inner && revenues) {
    var index = d3.nest()
      .key(get('FIPS'))
      .key(get('Year'))
      .key(get('Commodity'))
      .map(revenues);

    countyFeatures = countyFeatures.filter(function(d) {
      return d.id in index;
    });
  }

  var result = topojson.topology({
    counties: {
      type: 'FeatureCollection',
      features: countyFeatures
    },
    states: {
      type: 'FeatureCollection',
      features: stateFeatures
    }
  }, topojsonOptions);

  var c = result.objects.counties.geometries;
  assert.ok(c[0].type, 'no type for county geometry' + JSON.stringify(c[0]));

  var out = options.out || '/dev/stdout';
  // console.warn('writing topology to:', out);
  fs.createWriteStream(out)
    .write(JSON.stringify(result));
});

function noop(done) {
  done();
}
