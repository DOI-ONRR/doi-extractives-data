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
    return parse[unit](value);
  }
}

async.waterfall([
  function load(done) {
    util.readData(options._[0] || '/dev/stdin', tito.createReadStream('tsv'), done);
  },
  function thin(rows, done) {
    rows = rows.filter(function(d) {
      // skip summary rows
      if (!d['Reporting Companies'] || d['Reporting Companies'] === 'Total Revenue' || d['Reporting Companies'] === 'Key') {
        return false;
      }
      return d
    });
    console.warn('matched commodities for %d rows', rows.length);
    return done(null, rows);
  },
  function tweak(rows, done) {
    if (!rows.length) {
      // console.warn('WARNING: zero rows generated!');
      return done(null, rows);
    }

    var result = [];

    rows.forEach(function(d, i) {
      types.forEach(function(type) {
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
          var gov = parseValue(d[type + ' Government'], 'dollars')
          var company = parseValue(d[type + ' Company'], 'dollars')

          var isPos = typeof(company) == 'number'
            ? (gov - company) >= 0
            : true;

          result.push({
            'Company': d['Reporting Companies'],
            'Type': type,
            'Government Reported': gov,
            'Company Reported': company,
            'Variance Dollars': isPos
               ? parseValue(d[type + ' Variance $'], 'dollars')
               : -1 * parseValue(d[type + ' Variance $'], 'dollars'),
            'Variance Percent': isPos
             ? parseValue(d[type + ' Variance %'], 'percent')
             : -1 * parseValue(d[type + ' Variance %'], 'percent')

          });
        }
      });
    });
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
