#!/usr/bin/env node
var options = require('../lib/args')({
  usage: '$0 [options] [bea.csv]',
  'if': {
    desc: 'input format (tito-compatible)',
    default: 'csv'
  },
  'of': {
    desc: 'output format (tito-compatible)',
    default: 'tsv'
  },
  o: {
    desc: 'write output to this file',
    default: '/dev/stdout'
  }
});

var fs = require('fs');
var tito = require('tito').formats;
var thru = require('through2').obj;

fs.createReadStream(options._[0] || '/dev/stdin')
  .pipe(tito.createReadStream(options.if))
  .pipe(thru(mapRow))
  .pipe(tito.createWriteStream(options.of))
  .pipe(fs.createWriteStream(options.o));

function mapRow(d, enc, next) {
  var out = {};
  out.Category = d[''].trim();
  if (!out.Category || out.Category.match(/Addenda/)) {
    return next();
  }
  Object.keys(d).filter(isYear).forEach(function(year) {
    out[year] = d[year];
  });
  return next(null, out);
}

function isYear(key) {
  return key.match(/^\d{4}$/);
}
