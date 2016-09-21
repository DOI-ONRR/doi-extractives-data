#!/usr/bin/env node
/* jshint node: true, esnext: true */
var yargs = require('yargs');
var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var years = options._;

var async = require('async');
var d3 = require('d3');
var fs = require('fs');
var path = require('path');
var streamify = require('stream-array');
var thru = require('through2').obj;
var tito = require('tito').formats;

const fields = {
  code:     'own_code',
  fips:     'area_fips',
  aggLevel: 'agglvl_code',
  area:     'area_title',
  jobs:     'annual_avg_emplvl'
};

async.mapSeries(
  years,
  processYear,
  function(error, filenames) {
    console.log('wrote %d files', filenames.length);
  }
);

function processYear(year, done) {
  console.warn('joining year: %s', year);
  var all = {};
  var ext = [];

  async.parallel(
    [
      function readAll(next) {
        var filename = path.join(String(year), 'all.csv');
        readData(filename, function(error, data) {
          if (error) {
            return next(error);
          }

          data = data.filter(function(d) {
            // "Total Covered"
            return +d[fields.code] === 0 && validFips(d);
          });

          all = d3.nest()
            .key(function(d) { return d[fields.fips]; })
            .rollup(function(d) { return d[0]; })
            .map(data);

          return next();
        });
      },
      function readExt(next) {
        var filename = path.join(String(year), 'extractives.csv');
        readData(filename, function(error, data) {
          if (error) {
            return next(error);
          }

          ext = data.filter(function(d) {
            return validFips(d);
          });

          next();
        });
      }
    ],

    function(error) {
      if (error) {
        return done(error);
      }

      console.warn('%d: got %d extractives rows, %d all',
                   year, ext.length, Object.keys(all).length);

      var filename = path.join(String(year), 'joined.tsv');

      streamify(ext)
        .pipe(filterStream(year, all))
        .pipe(tito.createWriteStream('tsv'))
        .pipe(fs.createWriteStream(filename))
        .on('close', function() {
          console.warn('wrote', filename);
          done();
        });
    }
  );
}

function validFips(d) {
  var fips = d[fields.fips];
  return fips.match(/^\d\d/) && fips.substr(-2) !== '99';
}

function readData(filename, done) {
  var data = [];
  var ext = filename.split('.').pop();
  fs.createReadStream(filename)
    .pipe(tito.createReadStream(ext))
    .on('data', function(d) {
      data.push(d);
    })
    .on('end', function() {
      done(null, data);
    });
}

function filterStream(year, all) {
  return thru(function(ext, enc, next) {
    var fips = ext[fields.fips];
    var a = all[fips];
    if (!a) {
      console.warn('no all row:', fips);
      return next();
    }

    var jobs = +ext[fields.jobs];
    if (jobs > 0) {
      var total = +a[fields.jobs];
      var area = ext[fields.area];
      var d = {
        Year: year,
        State: '',
        County: '',
        FIPS: fips,
        Jobs: jobs,
        Total: total,
        Share: total ? (jobs / total).toFixed(4) : 0
      };
      if (area.indexOf('--') > -1) {
        area = area.split(' -- ');
        d.State = area[0];
      } else {
        area = area.split(', ');
        d.State = area[1];
        d.County = area[0];
      }
      next(null, d);
    } else {
      next();
    }
  });
}
