#!/usr/bin/env node
var yargs = require('yargs');
var options = yargs
  .option('in-states', {
    desc: 'the states data file',
    default: '_input/geo/states.csv'
  })
  .option('year', {
    desc: 'year or year range',
    default: '2004-2013'
  })
  .option('of', {
    desc: 'output format (tito-compatible)',
    default: 'tsv'
  })
  .option('o', {
    desc: 'output filename'
  })
  .argv;

if (options.help) {
  return yargs.showHelp();
}

var tito = require('tito').formats;
var request = require('request');
var qs = require('querystring');
var util = require('../../lib/util');
var thru = require('through2').obj;
var fs = require('fs');
var async = require('async');
var streamify = require('stream-array');

var jobsField = 'annual_avg_emplvl';
var areaAggrCode = 'agglvl_code';
var statesByFips = {};

var inputFiles = options._;

var loadStates = function(done) {
  util.readData(options['in-states'],
    tito.createReadStream('csv'),
    function(error, states) {
      if (error) return done(error);
      statesByFips = util.map(states, 'FIPS', true);
      done();
    });
};

var isValidRow = function(d) {
  // XXX 74 is the county aggregation level
  return d[areaAggrCode] == 74;
};

var mapRow = function(d) {
  var fips = d.area_fips;
  var stateFips = fips.length === 4
    ? '0' + fips.charAt(0)
    : fips.substr(0, 2);
  var state = statesByFips[stateFips];
  // console.warn('fips: %s ->', fips, stateFips);
  return {
    Year: d.year,
    State: state ? state.abbr : '',
    FIPS: fips,
    County: d.area_title.replace(/, [\w\s]+$/, ''),
    Jobs: +d[jobsField]
  };
};

var loadFiles = function(done) {
  async.mapSeries(inputFiles, function(filename, next) {
    console.warn('reading:', filename);
    var rows = [];
    fs.createReadStream(filename)
      .pipe(tito.createReadStream('csv'))
      .pipe(thru(function(d, enc, next) {
        if (isValidRow(d)) {
          // console.warn('add:', d[areaAggrCode]);
          rows.push(mapRow(d));
        } else {
          // console.warn('skip:', d[areaAggrCode]);
        }
        next();
      }))
      .on('finish', function() {
        next(null, rows);
      });
  }, function(error, years) {
    console.warn('loaded %d years', years.length);
    var rows = years.reduce(function(collection, set) {
      return collection.concat(set.filter(function(d) {
        return d.Jobs > 0;
      }));
    }, []);
    console.warn('got %d rows', rows.length);
    done(null, rows);
  });
};

var write = function(rows, done) {
  streamify(rows)
    .pipe(tito.createWriteStream(options.of))
    .pipe(fs.createWriteStream(options.o || '/dev/stdout'))
    .on('end', done);
};

async.waterfall([
  loadStates,
  loadFiles,
  write
], function(error) {
  if (error) return console.error('error:', error);
  console.warn('all done!');
});
