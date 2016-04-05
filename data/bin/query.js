#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options] "SELECT * FROM ..."')
  .describe('db', 'your database URL')
  .default('db', 'sqlite://data.db')
  .describe('o', 'the output file (defaults to stdout)')
  .describe('format', 'the output format')
  .default('format', 'tsv')
  .describe('help', 'show this help screen')
  .alias('h', 'help');

var options = yargs.argv;
var args = options._;
if (options.help || !args.length) {
  return yargs.showHelp();
}

var tito = require('tito');
var fs = require('fs');
var streamify = require('stream-array');
var Sequelize = require('sequelize');
var models = require('../db/config').models;

var db = new Sequelize(options.db, {
  logging: null,
  models: models
});

var format = tito.formats.createWriteStream(options.format);
var out = options.o
  ? fs.createWriteStream(options.o)
  : process.stdout;

var query = args[0];
// console.warn('executing:', query);

db.query(query).spread(function(results) {
  streamify(results)
    // write an extra line break at the end
    .on('end', function() {
      out.write('\n');
    })
    .pipe(format)
    .pipe(out);
});
