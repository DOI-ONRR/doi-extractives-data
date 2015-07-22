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
var util = require('../../lib/util');
var parse = require('../../lib/parse');
var async = require('async');
var streamify = require('stream-array');
var d3 = require('d3');

var revenueKey = 'Royalty/Revenue';
var regionKey = 'Offshore Region';
var areaKey = 'Planning Area';
var yearKey = 'Calendar Year'; // 'CY'

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
  var region = util.normalizeOffshoreRegion(d[regionKey]);
  if (!region) {
    console.error('no region for "%s" @ %d', d[regionKey], i);
    return process.exit(1);
  }
  var commodity = util.normalizeCommodity(d.Commodity);
  var type = util.normalizeRevenueType(d['Revenue Type']);
  return {
    Year:       d[yearKey],
    Region:     region,
    Area:       d[areaKey],
    Commodity:  commodity,
    Product:    d.Product,
    Type:       type,
    Revenue:    revenue
  };
}
