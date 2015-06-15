#!/usr/bin/env node
var yargs = require('yargs')
  .describe('org', 'The CF org to target')
  .alias('org', 'o')
  .default('org', 'eiti')
  .describe('app', 'The CF app to target')
  .alias('app', 'a')
  .default('app', 'eiti')
  .describe('space', 'The CF space to target')
  .alias('space', 's')
  .default('space', 'dev')
  .describe('domain', 'The CF domain')
  .alias('domain', 'd')
  .default('domain', '18f.gov')
  .alias('h', 'help');

var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

require('colors');

var org = options.org;
var space = options.space;
var app = options.app;
var domain = options.domain;
var hostname = [app, space].join('-');

var async = require('async');
var fs = require('fs');
var child = require('child_process');

var run = function(command, args, opts) {
  if (!opts) opts = {stdio: 'inherit'};
  return function(done) {
    console.log('[run] %s %s'.yellow, command, args.join(' '));
    return child.spawn(command, args, opts)
      .on('error', done)
      .on('exit', function(code, signal) {
        return done(code ? code : null, signal);
      });
  };
};

var echo = function() {
  var args = arguments;
  return function(done) {
    console.log.apply(console, args);
    return done();
  };
};

var manifest = 'manifest_' + space + '.yml';
if (!fs.existsSync(manifest)) {
  console.log('no space-specific manifest found: %s; using manifest.yml', manifest.red);
  manifest = 'manifest.yml';
}

async.series([
  echo('targeting: -o', org, '-s', space, '...'),
  run('cf', ['target', '-o', org, '-s', space]),
  // echo('mapping route: %s.%s', hostname, domain),
  // run('cf', ['map-route', app, domain, '-n', hostname]),
  echo('pushing with manfest:', manifest),
  run('cf', ['push', app, '-f', manifest]),
], function(error) {
  if (error) return console.error('error:', String(error).red);
});
