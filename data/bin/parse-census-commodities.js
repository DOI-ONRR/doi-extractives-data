#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] [output.tsv]')
  .describe('o', 'write output to this file')
  .describe('liberal', 'use more liberal HS6 associations')
  .boolean('liberal')
  .default('o', '/dev/stdout')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var tito = require('tito').formats;
var util = require('../../lib/util');
var async = require('async');
var streamify = require('stream-array');
var extend = require('extend');

var HS6 = {
  260112: 'Iron', // Iron
  260300: 'Copper', // Copper
  261690: 'Gold', // * includes gold, but also other precious metals
  270112: 'Coal',
  270119: 'Coal',
  270900: 'Oil',
  271111: 'Gas', // NGL
  271121: 'Gas',
  0: 'Total'
};

if (options.liberal) {
  var liberal = {
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
    28: 'Mining',
    0: 'Total'
  };
  extend(HS6, liberal);
}

function getCommodity(code) {
  // test the more specific codes first
  if (code === '0') {
    return HS6['0'];
  }

  for (var len = 6; len > 0; len -= 2) {
    var key = code.substr(0, len);
    if (key in HS6) return HS6[key];
    // console.warn('bad HS6:', key);
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
      if (d === '0' || d.HS6 === '25' || d.State === 'Unidentified') {
        console.warn('skipping row:', d);
        return false;
      }
      return d.Commodity = getCommodity(d.HS6);
    });
    console.warn('matched commodities for %d rows', rows.length);
    return done(null, rows);
  },
  function tweak(rows, done) {
    if (!rows.length) {
      console.warn('WARNING: zero rows generated!');
      return done(null, rows);
    }

    var years = Object.keys(rows[0]).filter(function(k) {
      return k.match(/val\d{4}$/);
    })
    .map(function(k) {
      return k.match(/\d+$/)[0];
    });

    var result = [];

    rows.forEach(function(d, i) {
      if (i === 0) console.warn(d, years);


      years.forEach(function(year) {
        var value = +d['val' + year] * 1e6;
        var share = +d['share' + year.substr(-2)] / 100
        if (!value) return;
        result.push({
          State:      d.State,
          Commodity:  d.Commodity,
          HS6:        d.HS6,
          Year:       year,
          Value:      value,
          Share:      share
        });
      });
    });

    done(null, result);
  },
  function consolidate(result, done) {

    var matched = {};

    // Create 'All' commodity
    result.forEach(function(value){
      var keyString = value.State + '-' + value.Year;

      // Don't include 'Total' in the sum of all
      if (value.Commodity !== 'Total') {

        if (matched[keyString]) {
          matched[keyString].Value += value.Value;
          matched[keyString].Share += value.Share;

        } else {
          matched[keyString] = {
            Value:      value.Value,
            Share:      value.Share,
            Commodity:  'All',
            Resource:   'All',
            State:      value.State,
            HS6:        '0',
            Resource:   'other',
            Year:       value.Year
          }
        }
      }
    });

    var matches = Object.keys(matched).map(function (key) {
      return matched[key];
    });

    result = result.concat(matches);

    done(null, result);
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
