#!/usr/bin/env node
// 'use strict';

// var yargs = require('yargs')
//   .option('if', {
//     desc: 'input format (tito-compatible)',
//     default: 'tsv'
//   })
//   .option('of', {
//     desc: 'output format (tito-compatible)',
//     default: 'tsv'
//   });

// var options = yargs.argv;
// var args = options._;

// var fs = require('fs');
// var tito = require('tito').formats;
// var thru = require('through2').obj;
// var parse = require('../../lib/parse');
// var _ = require('lodash');

// var input = args.length
//   ? fs.createReadStream(args[0])
//   : process.stdin;


var yargs = require('yargs')
  .usage('$0 [options] [output.tsv]')
  .describe('o', 'write output to this file')
  .describe('liberal', 'use more liberal HS6 associations')
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
var parse = require('../../lib/parse');


var types = [
  'Royalties',
  'Rents',
  'Bonus',
  'Other Revenue',
  'Offshore Inspection Fee',
  'ONRR Civil Penalties',
  'Bonus & 1st Year Rental',
  'Permit Fees',
  'Renewables',
  'AML Fees',
  'OSMRE Civil Penalties',
  'Corporate Income Tax Company'
];

String.prototype.regex = function(str) {
  str = str || this.slice(0, this.length);
  return new RegExp(str, "g");
}

var parseValue = function (value, unit) {
  if (value.match(/DNP/) || value.match(/DNR/) || value.match('N/A'.regex())) {
    return value;
  } else {
    // console.warn(parse[unit])
    return parse[unit](value);
    console.warn(value)
    var club = parse[unit](value);
    console.warn('---',club)
  }
}

async.waterfall([
  function load(done) {
    util.readData(options._[0] || '/dev/stdin', tito.createReadStream('tsv'), done);
  },
  function categorize(rows, done) {
    rows = rows.filter(function(d) {

      // skip summary rows
      if (!d['Reporting Companies'] || d['Reporting Companies'] === 'Total Revenue' || d['Reporting Companies'] === 'Key') {
        // console.warn('skipping row:', d['Reporting Companies']);
        return false;
      }
      return d
    });
    // console.warn(rows[0]['Reporting Companies'])

    // rows.forEach(function(row){
    //   console.warn(row['Reporting Companies'])
    // })
    console.warn('matched commodities for %d rows', rows.length);
    return done(null, rows);
  },
  function tweak(rows, done) {
    // console.warn(rows['Reporting Companies'])
    // console.warn(rows)
    if (!rows.length) {
      console.warn('WARNING: zero rows generated!');
      return done(null, rows);
    }

    // var years = Object.keys(rows[0]).filter(function(k) {
    //   return k.match(/val\d{4}$/);
    // })
    // .map(function(k) {
    //   return k.match(/\d+$/)[0];
    // });

    var result = [];

    rows.forEach(function(d, i) {
      // if (i === 0) console.warn(d, years);
      types.forEach(function(type) {
        // var value = +d['val' + year] * 1e6;
        // var share = +d['share' + year.substr(-2)] / 100
        // if (!value) return;
        if (type === 'Corporate Income Tax Company') {
          result.push({
            'Company': d['Reporting Companies'],
            'Type':  type,
            'Government Reported': 0,
            'Company Reported': parseValue(d[type],'dollars'),
            'Variance Dollars': 0,
            'Variance Percent': 0
          });
        } else {
          result.push({
            // 'Company': d['Reporting Companies'],
            // 'Type':  type,
            // 'Government Reported': parse.dollars(d[type + ' Government']),
            // 'Company Reported': parse.dollars(d[type + ' Company']),
            // 'Variance Dollars': parse.dollars(d[type + ' Variance $']),
            // 'Variance Percent': parse.percent(d[type + ' Variance %'])
            'Company': d['Reporting Companies'],
            'Type': type,
            'Government Reported': parseValue(d[type + ' Government'], 'dollars'),
            'Company Reported': parseValue(d[type + ' Company'], 'dollars'),
            'Variance Dollars': parseValue(d[type + ' Variance $'], 'dollars'),
            'Variance Percent': parseValue(d[type + ' Variance %'], 'percent')
          });
        }
      });
    });
    // done(null, rows);
    // console.warn(result)
    done(null, result);
  }
], function(error, rows) {
  if (error) return console.error('error:', error);

  var out = fs.createWriteStream(options.o);
  streamify(rows)
    .pipe(tito.createWriteStream('tsv'))
    .pipe(out);
});

// input
//   .pipe(tito.createReadStream(options['if']))
//   .pipe(thru(function(d, enc, next) {
//     // console.warn('----', d)
// // .match(/types/)

//     if (d['Reporting Companies'] === 'Total Revenue') {
//       return;
//     }
//     var newD = [];
//     var obj = {};
//     obj['Company'] = d['Reporting Companies'].trim();
//     obj['Type'] = 'Royalties'
//     obj['Government Reported'] = d['Royalties Government']
//     obj['Company Reported'] = d['Royalties Company']
//     obj['Variance $'] = d['Royalties Variance $']
//     obj['Variance %'] = d['Royalties Variance %']
//     newD.push(obj);

//     console.warn('----', obj)

//     // trim whitespace
//     // d.Company = d.Company.trim();
//     // // parse revenue $$$
//     // d.Revenue = parse.dollars(d.Revenue);
//     next(null, obj);

//     // consider making an array of array of objects, then using _.flatten to consolidate to one array for a given line.
//     // or talk to @shawnbot about ways to create multiple rows for a given row.
//   }))
//   .pipe(tito.createWriteStream(options['of'])) // jshint ignore:line
//   .pipe(process.stdout);
