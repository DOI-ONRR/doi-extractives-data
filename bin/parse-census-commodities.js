#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] [output.tsv]')
  .describe('o', 'write output to this file')
  .default('o', '/dev/stdout')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var tito = require('tito').formats;
var util = require('../lib/util');
var async = require('async');
var streamify = require('stream-array');
var extend = require('extend');

var HS6 = {
  // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=25>
  25: 'Mining',
  // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=26>
  26: 'Mining',
  // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=27>
  2701: 'Coal',
  2709: 'Oil',
  2710: 'Oil',
  2711: 'Oil',
  2713: 'Oil',
  2714: 'Oil',
  2715: 'Oil',
  // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=28>
  2800: 'Mining',
};

function getCommodity(code) {
  for (var len = 4; len > 0; len--) {
    var key = code.substr(0, len);
    if (HS6.hasOwnProperty(key)) return HS6[key];
  }
  return null;
}

async.waterfall([
  function load(done) {
    util.readData(options._[0] || '/dev/stdin', tito.createReadStream('tsv'), done);
  },
  function categorize(rows, done) {
    rows = rows.filter(function(d) {
      // skip summary rows
      if (d.HS6 === '0' || d.HS6 === '25') {
        return false;
      }
      return d.Commodity = getCommodity(d.HS6);
    });
    console.warn('matched commodities for %d rows', rows.length);
    return done(null, rows);
  },
  function tweak(rows, done) {
    if (!rows.length) return done(null, rows);

    var years = Object.keys(rows[0]).filter(function(k) {
      return k.match(/val\d{4}$/);
    })
    .map(function(k) {
      return k.match(/\d+$/)[0];
    });

    rows.forEach(function(d) {
      rename(d, 'change', 'Change');
      years.forEach(function(y) {
        rename(d, 'val' + y, y + ' Value');
        rename(d, 'share' + y.substr(-2), y + ' Share');
      });
    });

    done(null, rows);
  }
], function(error, rows) {
  if (error) return console.error('error:', error);

  var out = fs.createWriteStream(options.o);
  streamify(rows)
    .pipe(tito.createWriteStream('tsv'))
    .pipe(out);
});

function rename(obj, src, dest) {
  obj[dest] = obj[src];
  delete obj[src];
}
