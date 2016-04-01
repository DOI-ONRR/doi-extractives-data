#!/usr/bin/env node
var tito = require('tito');
var Sequelize = require('sequelize');
var models = require('../db/config').models;
var streamify = require('stream-array');
var db = new Sequelize('sqlite://data.db', models);

var out = tito.formats.createWriteStream('tsv');
var query = process.argv[2];

// console.warn('executing:', query);

db.query(query).spread(function(results, meta) {
  streamify(results)
    .pipe(out)
    .pipe(process.stdout);
});
