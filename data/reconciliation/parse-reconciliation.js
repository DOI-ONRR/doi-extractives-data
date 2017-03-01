#!/usr/bin/env node
/* jshint node: true, esnext: true */
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
var parse = require('../../lib/parse');

const COMPANY_NAME = 'Reporting Companies';

const YEAR = process.env.REVENUE_YEAR;
if (!YEAR) {
  throw new Error('The REVENUE_YEAR env var is not set!');
}

const TYPES = [
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
  'Corporate Income Tax',
];

var parseValue = function (value, unit) {
  if (!value) {
    return 'N/A';
  } else if (value.match(/DNP/)) {
    return 'did not participate';
  } else if (value.match(/DNR/)) {
    return 'did not report';
  } else if (value.match(/N\/A/)) {
    return 'N/A';
  } else {
    return parse[unit](value);
  }
};

var roundTwoDecimal = function(num) {
  return typeof(num) == 'number'
    ? Math.round(num * 100) / 100
    : num;
};

async.waterfall([
  function load(done) {
    util.readData(
      options._[0] || '/dev/stdin',
      tito.createReadStream('tsv'),
      done
    );
  },
  function thin(rows, done) {
    rows = rows.filter(function(d) {
      // skip summary rows
      var summary = !d[COMPANY_NAME]
        || d[COMPANY_NAME] === 'Total Revenue'
        || d[COMPANY_NAME] === 'Key';
      if (summary) {
        return false;
      }
      return d;
    });
    console.warn('matched commodities for %d rows', rows.length);
    return done(null, rows);
  },
  function patchTaxes(rows, done) {
    var sourceFilename = options._[0];
    var taxesFilename = sourceFilename.replace('.tsv', '-taxes.tsv');
    if (taxesFilename === sourceFilename) {
      return done(null, rows);
    } else {
      console.warn('checking for the existence of:', taxesFilename);
    }

    fs.exists(taxesFilename, function(exists) {
      if (exists) {
        console.warn('reading tax patches from:', taxesFilename);
        util.readData(
          taxesFilename,
          tito.createReadStream('tsv'),
          function(error, taxRows) {
            var taxesByCompany = taxRows.reduce(function(map, row) {
              map[row[COMPANY_NAME]] = row;
              return map;
            }, {});

            rows.forEach(function(row) {
              var company = row[COMPANY_NAME];
              if (company in taxesByCompany) {
                console.warn('patch:', company, row);
                Object.assign(row, taxesByCompany[company]);
              }
            });

            done(null, rows);
          }
        );
      } else {
        done(null, rows);
      }
    });
  },
  function tweak(rows, done) {
    if (!rows.length) {
      return done(null, rows);
    }

    var result = [];

    rows.forEach(function(d) {
      TYPES.forEach(function(type) {
          var gov = parseValue(d[type + ' Government'], 'dollars');
          var company = parseValue(d[type + ' Company'], 'dollars');
          var varianceDollars = parseValue(d[type + ' Variance $'], 'dollars');

          var isPos = typeof(company) == 'number'
            ? (gov - company) >= 0
            : true;

          var precisePercent = typeof(varianceDollars) !== 'number'
            ? varianceDollars
            : varianceDollars === 0
              ? 0
              : gov === 0
                ? 100
                : roundTwoDecimal(Math.abs(
                    100 * varianceDollars / Math.abs(gov)
                  ));

          result.push({
            'Year': YEAR,
            'Company': d['Reporting Companies'],
            'Type': type,
            'Government Reported': gov,
            'Company Reported': company,
            'Variance Dollars': isPos
               ? parseValue(d[type + ' Variance $'], 'dollars')
               : -1 * parseValue(d[type + ' Variance $'], 'dollars'),
            'Variance Percent': precisePercent,
          });
      });
    });

    done(null, result);
  }
], function(error, rows) {
  if (error) {
    return console.error('error:', error);
  }

  var out = fs.createWriteStream(options.o);
  streamify(rows)
    .pipe(tito.createWriteStream('tsv'))
    .pipe(out);
});
