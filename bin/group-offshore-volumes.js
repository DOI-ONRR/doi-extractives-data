#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] volumes.tsv')
  .describe('o', 'write output to this file')
  .default('o', '/dev/stdout')
  .describe('keys', 'group on these (slash-separated) keys')
  .default('keys', ['Year', 'Region', 'Area', 'Commodity', 'Product'].join('/'))
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

var volumeKey = 'Sales Volumes';
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
        return d.Volume;
      });

    var diff = len - rows.length;
    if (diff) console.warn('removed %d rows without volume', diff);

    var keys = Array.isArray(options.keys)
      ? options.keys
      : options.keys.split('/');
    var groups = util.group(rows, keys)
      .map(function(group) {
        var d = group.key;
        d.Volume = d3.sum(group.values, util.getter('Volume')).toFixed(2);
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
  console.warn('parsing:', d);
  var volume = parse.dollars(d[volumeKey]);
  var region = util.normalizeOffshoreRegion(d[regionKey]);
  if (!region) {
    console.error('no region for "%s" @ %d', d[regionKey], i);
    return process.exit(1);
  }
  var commodity = util.normalizeCommodity(d.Commodity);
  return {
    Year:       d[yearKey],
    Region:     region,
    Area:       d[areaKey],
    Commodity:  commodity,
    Product:    d.Product,
    Volume:     volume
  };
}
