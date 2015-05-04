#!/usr/bin/env node
var yargs = require('yargs')
  .describe('if', 'input format')
  .default('if', 'tsv')
  .describe('of', 'output format')
  .default('of', 'tsv')
  .describe('group', 'comma-separated list of keys to group on')
  .default('group', 'Year,Commodity')
  .describe('sum', 'the column to sum')
  .default('sum', 'Revenue')
  .describe('count', 'include the grouped row count as this named column')
  .describe('o', 'write to this file')
  .default('o', '/dev/stdout')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var args = options._;

var fs = require('fs');
var tito = require('tito').formats;
var util = require('../lib/util');
var streamify = require('stream-array');
var async = require('async');

var rows = [];
async.series(args.map(function(filename) {
  return function(done) {
    var read = tito.createReadStream(options['if']);
    util.readData(filename, read, function(error, data) {
      if (error) return done(error);
      console.warn('read %d rows from %s', data.length, filename);
      done(null, rows = rows.concat(data));
    });
  };
}), function(error) {
  if (error) {
    console.error('error:', error);
    process.exit(1);
  }

  var keys = options.group.split(/\s*,\s*/);
  var value = util.getter(options.sum);
  var groups = util.group(rows, keys, function(subset) {
    return subset.values.reduce(function(sum, d) {
      return sum + Number(value(d));
    }, 0);
  })
  .map(function(entry) {
    var row = entry.key;
    row[options.sum] = entry.value;
    if (options.count) {
      row[options.count] = entry.length;
    }
    return row;
  });

  console.warn('got %d rows', groups.length, groups[0]);

  streamify(groups)
    .pipe(tito.createWriteStream(options['of']))
    .pipe(fs.createWriteStream(options.o));
});
