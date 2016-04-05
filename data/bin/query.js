#!/usr/bin/env node
var tito = require('tito');
var streamify = require('stream-array');
var Sequelize = require('sequelize');
var models = require('../db/config').models;

var db = new Sequelize('sqlite://data.db', {
  logging: null,
  models: models
});

var format = tito.formats.createWriteStream('tsv');
var out = process.stdout;
var query = process.argv[2];

// console.warn('executing:', query);

db.query(query).spread(function(results) {
  streamify(results)
    // write an extra line break at the end
    .on('end', function() {
      out.write('\n');
      process.exit(0);
    })
    .pipe(format)
    .pipe(out);
});
