#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] [output.tsv]')
  .describe('o', 'write output to this file')
  .describe('liberal', 'use more liberal HS6 associations')
  .boolean('liberal')
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
  const MINING = 'Other nonenergy minerals';
  HS6 = {
    // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=25>
    25: MINING,
    // 26: MINING,
    // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=26>
    260112: 'Iron',
    2603: 'Copper',
    261610: 'Silver',
    261690: 'Gold', // * includes gold, but also other precious metals
    // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=27>
    2701: 'Coal',
    2709: 'Oil',
    2710: 'Oil',
    2711: 'Gas',
    2713: 'Oil',
    2714: 'Oil',
    2715: 'Oil',
    // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=28>
    28: MINING,
    // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=7106>
    710610: 'Silver',
    710691: 'Silver',
    // see: <http://www.foreign-trade.com/reference/hscode.cfm?code=7108>
    710811: 'Gold',
    710812: 'Gold',
    // 72: 'Mining', // "base metals"???
    0: 'Total'
  };

  for (var code = 2601; code <= 2621; code++) {
    var exists = false;
    for (var key in HS6) {
      if (key.substr(0, 4) == code) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      HS6[code] = MINING;
    }
  }
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
  }
], function(error, rows) {
  if (error) return console.error('error:', error);

  var out = options.o
    ? fs.createWriteStream(options.o)
    : process.stdout;
  streamify(rows)
    .pipe(tito.createWriteStream('tsv'))
    .pipe(out);
});

function rename(obj, src, dest) {
  obj[dest] = obj[src];
  delete obj[src];
}
