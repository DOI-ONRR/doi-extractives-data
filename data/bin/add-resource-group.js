#!/usr/bin/env node
var yargs = require('yargs')
  .describe('if', 'input format')
  .default('if', 'tsv')
  .describe('of', 'output format')
  .default('of', 'tsv')
  .describe('in-column', 'the input (commodity) column')
  .default('in-column', 'Commodity')
  .describe('out-column', 'the output (resource group) column')
  .default('out-column', 'Resource')
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
var thru = require('through2').obj;

var commodities = require('../commodities.json').commodities;
var inKey = options['in-column'];
var outKey = options['out-column'];

fs.createReadStream(args[0] || '/dev/stdin')
  .pipe(tito.createReadStream(options['if']))
  .pipe(thru(function(d, enc, next) {
    var c = commodities[d[inKey]];
    if (c) {
      d[outKey] = c.group;
    } else {
      d[outKey] = 'other'; // FIXME
      // throw new Error('no commodity for: "' + d[inKey] + '"');
    }
    next(null, d);
  }))
  .pipe(tito.createWriteStream(options['of']))
  .pipe(fs.createWriteStream(options.o || '/dev/stdout'));
