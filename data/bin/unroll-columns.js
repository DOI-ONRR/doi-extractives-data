#!/usr/bin/env node
var yargs = require('yargs')
  .describe('columns', 'Column(s) to unroll, separated by commas')
  .describe('destkey', 'Destination column for the unrolled key(s)')
  .default('destkey', 'Year')
  .describe('valkey', 'Destination column for the unrolled value(s)')
  .default('valkey', 'Value')
  .describe('if', 'Tito input format (csv, tsv, json)')
  .default('if', 'tsv')
  .describe('of', 'Tito output format (csv, tsv, json)')
  .default('of', 'tsv')
  .describe('skip', 'Input columns (comma-separated) to skip')
  .wrap(80);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var tito = require('tito');
var through2 = require('through2');
var extend = require('extend');

var keys = options.columns
  ? options.columns.split(/\s*,\s*/)
  : null;
var destkey = options.destkey;
var valkey = options.valkey;
var skip = options.skip ? options.skip.split(/\s*,\s*/) : null;
var NODATA = '--';

process.stdin
  .pipe(tito.formats.createReadStream(options['if']))
  .pipe(through2.obj(function(row, enc, next) {

    if (!keys) {
      keys = Object.keys(row).filter(function(key) {
        return key.match(/^\d+$/);
      });
      // console.warn('keys:', keys);
    }

    if (skip) {
      skip.forEach(function(key) {
        delete row[key];
      });
    }

    var unrolled = extend({}, row);

    keys.forEach(function(key) {
      delete unrolled[key];
    });

    keys.forEach(function(key) {
      var value = row[key];
      if (value && value !== NODATA) {
        unrolled[destkey] = key;
        unrolled[valkey] = row[key];
        this.push(unrolled);
      }
    }, this);

    next();
  }))
  .pipe(tito.formats.createWriteStream(options['of']))
  .pipe(process.stdout);
