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

var params = {
  UserID:       options.user || process.env.BEA_API_KEY,
  DataSetName:  'RegionalProduct',
  Method:       'GetData',
  Year:         years.join(','),
  Component:    'GDP_SAN',
  GeoFips:      'STATE'
};

var fetch = function(params) {
  var url = [
    'http://www.bea.gov/api/data/',
    qs.stringify(params)
  ].join('?');
  console.warn('fetching:', params, '->', url);
  return request(url);
};

var ALL_INDUSTRY = 1;
// see <https://gist.github.com/shawnbot/df545e15a400b66bc7b4>
// for a table of possible industry IDs
var industryIds = [ALL_INDUSTRY, 6, 7, 8, 9, 10];

var parser = function() {
  return tito.createReadStream('json', {
    path: '.BEAAPI.Results.Data.*'
  });
};

async.mapSeries(industryIds, function(id, next) {
  params.IndustryId = id;
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
    var value = 0;

    group.values.forEach(function(d) {
      total += coerceNumber(d.Total);
      value += coerceNumber(d.Value);
    });

    return {
      Value: value,
      Share: (value / total).toFixed(4),
      Total: total
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
    // FIPS: row.GeoFips,
    Year: row.TimePeriod,
    Value: row.DataValue * ONE_MILLION
  };
}

function noop(error) {
  console.warn('error?', error);
}

function coerceNumber(str) {
  return Number(str) || 0;
}
