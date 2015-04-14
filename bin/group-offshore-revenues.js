#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] revenues.tsv')
  .describe('o', 'write output to this file')
  .default('o', '/dev/stdout')
  .describe('keys', 'group on these (slash-separated) keys')
  .default('keys', ['Year', 'Region', 'Area', 'Commodity', 'Type'].join('/'))
  .describe('count', 'include the grouped row count as this named column')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var tito = require('tito').formats;
var util = require('../lib/util');
var parse = require('../lib/parse');
var async = require('async');
var streamify = require('stream-array');
var d3 = require('d3');

var regionNameMap = {
  'Alaska- Offshore': 'Alaska',
  'Gulf of Mexico': 'Gulf',
};

var revenueKey = 'Royalty/Revenue';
var regionKey = 'State/Offshore Region';
var areaKey = 'Offshore Area';

async.waterfall([
  function loadRevenues(done) {
    util.readData(options._[0] || '/dev/stdin', tito.createReadStream('tsv'), done);
  },
  function groupRevenues(rows, done) {
    var len = rows.length;
    rows = rows.map(mapRow)
      .filter(function(d) {
        return d.Revenue;
      });

    var diff = len - rows.length;
    if (diff) console.warn('removed %d rows without revenues', diff);

    var keys = Array.isArray(options.keys)
      ? options.keys
      : options.keys.split('/');
    var groups = util.group(rows, keys)
      .map(function(group) {
        var d = group.key;
        d.Revenue = d3.sum(group.values, util.getter('Revenue')).toFixed(2);
        if (options.count) {
          d[options.count] = group.values.length;
        }
        return d;
      });
    done(null, groups);
  }
], function(error, groups) {
  if (error) return console.error('error:', error);

  var out = fs.createWriteStream(options.o);
  streamify(groups)
    .pipe(tito.createWriteStream('tsv'))
    .pipe(out);
});

function mapRow(d, i) {
  util.trimKeys(d);
  var revenue = parse.dollars(d[revenueKey]);
  var region = d[regionKey];
  region = regionNameMap[region] || region;
  if (!region) {
    console.error('no region for "%s" @ %d', d[regionKey], i);
    return process.exit(1);
  }
  return {
    Year:       d.CY,
    Region:     region,
    Area:       d[areaKey],
    Commodity:  d.Commodity,
    Product:    d.Product,
    Type:       d['Revenue Type'],
    Revenue:    revenue
  };
}
