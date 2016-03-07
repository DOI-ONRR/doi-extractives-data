#!/usr/bin/env node
'use strict';

var yargs = require('yargs')
  .option('if', {
    desc: 'input format (tito-compatible)',
    default: 'tsv'
  })
  .option('of', {
    desc: 'output format (tito-compatible)',
    default: 'tsv'
  });

var options = yargs.argv;
var args = options._;

var fs = require('fs');
var tito = require('tito').formats;
var thru = require('through2').obj;
var parse = require('../../lib/parse');

var input = args.length
  ? fs.createReadStream(args[0])
  : process.stdin;

input
  .pipe(tito.createReadStream(options['if']))
  .pipe(thru(function(d, enc, next) {
    // trim whitespace
    d.Company = d.Company.trim();
    // parse revenue $$$
    var revenue = d.Revenue.trim();
    if (revenue !== 'Withheld') {
      d.Revenue = parse.dollars(d.Revenue);
    }
    next(null, d);
  }))
  .pipe(tito.createWriteStream(options['of'])) // jshint ignore:line
  .pipe(process.stdout);
