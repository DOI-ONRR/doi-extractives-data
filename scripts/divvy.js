#!/usr/bin/env node
var yargs = require('yargs')
  .demand(1)
  .describe('path', 'The path template, a la Handlebars: "foo/{{ key }}"')
  .describe('if', 'input format')
  .default('if', 'ndjson')
  .describe('of', 'output format')
  .default('of', 'ndjson')
  .alias('h', 'help')
  .wrap(72);

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var fs = require('fs');
var tito = require('tito').formats;
var thru = require('through2').obj;
var path = require('path');
var streamify = require('stream-array');
var mkdirp = require('mkdirp');
var async = require('async');
var template = require('../lib/template');

var read = tito.createReadStream(options['if']);

var args = options._;

var getPath = template(args[0]);
var paths = {};
var dirs = {};

process.stdin
  .pipe(read)
  .pipe(thru(function(d, enc, next) {
    var p = getPath(d);
    if (paths.hasOwnProperty(p)) {
      paths[p].push(d);
    } else {
      console.warn('+ path:', p);
      paths[p] = [d];
    }
    next();
  }, function flush(done) {
    var tasks = Object.keys(paths)
      .map(function(key) {
	return {
	  filename: key,
	  data: paths[key]
	};
      });
    async.map(tasks, writePath, function(error) {
      if (error) console.log('error:', error);
      console.warn('all done!');
    });
  }));

function makeDirs(dir, done) {
  fs.exists(dir, function(exists) {
    if (exists) return done(null, dir);
    console.warn('mkdir -p "%s"', dir);
    mkdirp(dir, done);
  });
}

function writePath(task, done) {
  var filename = task.filename;
  var data = task.data;

  var dir = path.dirname(filename);

  makeDirs(dir, function(error) {
    if (error) return done(error);
    console.warn('writing %d rows to "%s"...', data.length, filename)

    var write = tito.createWriteStream(options['of']);

    streamify(data)
      .pipe(write)
      .pipe(fs.createWriteStream(filename))
      .on('error', done)
      .on('end', function() {
	done(null, task);
      });
  });
}
