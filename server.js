#!/usr/bin/env node
var yargs = require('yargs')
  .usage('$0 [options]')
  .describe('port', 'The port on which to listen (or process.env.PORT)')
  .default('port', 4000)
  .describe('ssl-cert', 'Specify the SSL certificate flie to use for HTTPS')
  .describe('ssl-key', 'Specify the SSL key file to use for SSL')
  .alias('h', 'help');

// command line arguments
var options = yargs.argv;
if (options.help) {
  return yargs.showHelp();
}

var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

// positional arguments
var argc = options._;

require('colors');

var express = require('express');
var nunjucks = require('nunjucks');
var extend = require('extend');
var assert = require('assert');
var fs = require('fs');
var sass = require('node-sass-middleware');

// web server helper functions
var helpers = require('./lib/server-helpers');
var view = helpers.view;
var redirect = helpers.redirect;
var api = helpers.api;

var app = express();

// render html with nunjucks
var env = nunjucks.configure(__dirname + '/views');
var filters = require('./lib/server-filters');
filters.register(env);

app.engine('html', env.render.bind(env));
app.set('view engine', 'html');

// static assets
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/js/lib', express.static(__dirname + '/lib'));
app.use('/css', sass({
  src: __dirname + '/styles/sass',
  dest: __dirname + '/styles/css',
  outputStyle: 'nested',
  debug: false,
  force: true,
  sourceMap: true
}));
app.use('/css/fonts', express.static(__dirname + '/styles/css/fonts'));
app.use('/data', express.static(__dirname + '/data/output'));
app.use('/data/commodities.json', express.static(__dirname + '/data/commodities.json'));

// get the data decorator
var data = require('./data/decorator');

// common data
app.use(function(req, res, next) {
  // make "request" available in templates
  // e.g.:
  // {{ request.params.state }}
  // {{ request.query.search }}
  // "{{ request.path }}?foo=bar"
  res.locals.request = req;

  // make filters available as template functions
  extend(res.locals, filters.filters);

  var then = Date.now();
  req.on('end', function() {
    var elapsed = Date.now() - then;
    console.log('%s took %ss'.yellow, req.url, (elapsed / 1000).toFixed(3));
  });
  next();
}, data.decorate(['resources', 'locations']));

var DEFAULTS = {
  resource: 'all',
  datatype: 'revenue',
  location: 'US'
};
// TODO: insert DEFAULTS values into these, to keep it DRY
app.get('/resources/', helpers.redirect('/resources/all/revenue/US'));
app.get('/resources/:resource/', helpers.redirect('/resources/:resource/revenue/US'));
app.get('/resources/:resource/:datatype/', helpers.redirect('/resources/:resource/:datatype/US'));

// sets the location_prefix_url for use with the location_selector() macro
[
  '/resources/:resource/:datatype/:region',
  '/resources/:resource/:datatype/:region/:subregion',
].forEach(function(url) {
  app.get(url, function(req, res, next) {
    var url = helpers.expand('/resources/:resource/:datatype/', req.params, DEFAULTS);
    res.locals.location_prefix_url = url;
    next();
  });
});

// always add resource data to these URLs
app.get('/resources/:resource*', data.decorate(['resource']));
// always add state data to these URLS, aliased in templates as `region`
app.get('/resources/:resource/:datatype/onshore/:state*', data.decorate(['state']), function(req, res, next) {
  res.locals.region = res.locals.state;
  next();
});
// and always add offshore area to these URL, aliased in templates as `region`
app.get('/resources/:resource/:datatype/offshore/:area*', data.decorate(['offshoreArea']), function(req, res, next) {
  res.locals.region = res.locals.offshoreArea;
  next();
});

// load routes from routes.yml
var yaml = require('js-yaml');
var routes = yaml.safeLoad(fs.readFileSync('routes.yml', 'utf8'));
helpers.addRoutes(app, routes, data);

app.listen(appEnv.port, appEnv.bind, function(error) {
  if (error) return console.error('error:', error);
  var server = this;
  var addr = server.address();
  console.log('listening @ http://%s:%d', '127.0.0.1', addr.port);
  process.on('exit', function() {
    server.close();
  });
});

if (options['ssl-cert'] && options['ssl-key']) {
  var https = require('https');
  var httpsServer = https.createServer({
    key: fs.readFileSync(options['ssl-key']),
    cert: fs.readFileSync(options['ssl-cert'])
  }, app).listen(4001);
  process.on('exit', function() {
    httpsServer.close();
  });
}
