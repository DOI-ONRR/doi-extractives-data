#!/usr/bin/env node
var options = require('yargs')
  .option('user', {
    desc: 'your BEA API user ID'
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

var tito = require('tito').formats;
var request = require('request');
var qs = require('querystring');
var _url = require('url');
var util = require('../../lib/util');
var thru = require('through2').obj;
var fs = require('fs');
var async = require('async');
var extend = require('extend');
var streamify = require('stream-array');

var ONE_MILLION = 1e6;
var years = util.range(options.year);

var lineCodes = {
  total: 10,    // "[SA25N] Total employment"
  mining: 200,  // "[SA25N] Mining"
};

var tables = {
  total:    'SA25N', // "Total Full-Time and Part-Time Employment by NAICS Industry"
  subtotal: 'SA27N', // "Full-Time and Part-Time Wage and Salary Employment by NAICS Industry"
};

var params = {
  UserID:       options.user || process.env.BEA_API_KEY,
  DataSetName:  'RegionalIncome',
  Method:       'GetData',
  Year:         years.join(','),
  GeoFips:      'STATE',
  LineCode:     lineCodes.mining
};

var fetch = function(params) {
  var url = [
    'http://www.bea.gov/api/data/',
    qs.stringify(params)
  ].join('?');
  console.warn('fetching:', params, '->', url);
  return request(url);
};

var parser = function() {
  return tito.createReadStream('json', {
    path: '.BEAAPI.Results.Data.*'
  });
};

var tableIds = [tables.total, tables.subtotal];

async.mapSeries(tableIds, function(table, next) {
  params.TableName = table;

  var rows = [];
  var done = function(error) {
    if (error) console.warn('error?', error);
    next(null, rows);
  };

  fetch(params)
    .on('error', done)
    .pipe(parser())
    .on('data', function(row) {
      row = mapRow(row);
      if (row) {
        console.warn('+ row:', row);
        rows.push(row);
      }
    })
    .on('end', done);
}, function(error, sets) {
  if (error) return console.error('error:', error);

  console.warn('got %d sets', sets.length);

  sets[0].forEach(function(d) {
    d.Total = d.Value;
    d.Value = 0;
  });

  var rows = sets.reduce(function(list, set) {
    return list.concat(set);
  }, []);

  var keys = ['Region', 'Year'];
  var result = util.group(rows, keys, function(group) {
    var total = 0;
    var actual = 0;

    group.values.forEach(function(d) {
      total += coerceNumber(d.Total);
      actual += coerceNumber(d.Value);
    });

    return {
      Total: total,
      Actual: actual,
      Value: total - actual,
    };
  })
  .map(function(entry) {
    return extend(entry.key, entry.value);
  });

  console.warn('got %d rows', result.length);
  console.warn(result[0]);

  streamify(result)
    .pipe(tito.createWriteStream(options.of))
    .pipe(fs.createWriteStream(options.o || '/dev/stdout'))
    .on('end', function() {
      console.warn('wrote %d rows', result.length);
    });
});

function mapRow(row) {
  var fips = row.GeoFips.substr(0, 2);
  if (fips > 90) {
    return;
  }
  return {
    Region: row.GeoName,
    Year:   row.TimePeriod,
    Value:  row.DataValue
  };
}

function noop(error) {
  console.warn('error?', error);
}

function coerceNumber(str) {
  return Number(str) || 0;
}
