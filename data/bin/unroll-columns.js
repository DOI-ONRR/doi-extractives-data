#!/usr/bin/env node
/* jshint node: true, esnext: true */
/* jshint -W069 */
var yargs = require('yargs')
  .describe('i', 'the input file (defaults to stdin)')
  .describe('o', 'the output file (defaults to stdout)')
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

const NODATA = '--';

var tito = require('tito');
var fs = require('fs');
var through2 = require('through2');
var extend = require('extend');

var keys = options.columns
  ? options.columns.split(/\s*,\s*/)
  : null;
var destkey = options.destkey;
var valkey = options.valkey;
var skip = options.skip ? options.skip.split(/\s*,\s*/) : null;

var input = options.i ? fs.createReadStream(options.i) : process.stdin;
var inputFormat = options['if'];
var output = options.o ? fs.createWriteStream(options.o) : process.stdout;
var outputFormat = options['of'];

var parse = tito.formats.createReadStream(inputFormat);
var format = tito.formats.createWriteStream(outputFormat);

var isNumeric = function(key) {
  return key.match(/^\d+$/);
};

var unroll = through2.obj(function(row, enc, next) {
  if (!keys) {
    keys = Object.keys(row).filter(isNumeric);
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
});

input
  .pipe(parse)
  .pipe(unroll)
  .pipe(format)
  .pipe(output);
