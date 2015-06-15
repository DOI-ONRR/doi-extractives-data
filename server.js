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
var Festoon = require('festoon');

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
app.use('/js', express.static(__dirname + '/js'));
app.use('/js/lib', express.static(__dirname + '/lib'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/data', express.static(__dirname + '/output'));

var data = new Festoon({
  path: __dirname + '/output',
  sources: {
    // master resources (commodities) list, plus other metadata
    resources:  './data/commodities.json',

    // single resource: {slug, name, colors, (sub-)commodities}
    resource: Festoon.transform('resources', function(resources, params) {
      var slug = params.resource;
      if (!resources.groups[slug]) return null;
      return {
        slug: slug,
        name: resources.groups[slug],
        colors: resources.colors[slug],
        commodities: Object.keys(resources.commodities)
          .map(function(name) {
            return resources.commodities[name].group === slug;
          })
      };
    }),

    locations: {
      onshore: '#states',
      offshore: '#offshoreAreas'
    },

    // revenues
    nationalRevenue: {
      onshore: '#stateRevenues',
      offshore: '#offshoreRevenues'
    },

    // production volumes
    nationalProduction: {
      onshore: '#stateProduction',
      offshore: '#offshoreProduction'
    },

    // state data sources
    states: './input/geo/states.csv',
    state: {
      // {{ state.meta.name }}
      meta: Festoon.findByParam('states', 'state', 'abbr'),
      // {{ state.revenues[] }}
      revenues: Festoon.transform.filter('stateRevenues', function(d) {
        return d.State === this.state;
      }),
      // {{ state.production[] }}
      production: Festoon.transform.filter('stateProduction', function(d) {
        return d.State === this.state;
      })
    },

    // topology: 'geo/us-topology.json',

    counties: 'county/by-state/:state/counties.tsv',

    allCounties: 'county/counties.tsv',

    county: {
      name: function(params, done) {
        return done(null, params.county);
      },
      revenues: Festoon.transform.filter('countyRevenues', function(d) {
        return d.County === this.county;
      })
    },

    areas: '#offshoreAreas',
    area: '#offshoreArea',

    // offshore planning areas
    offshoreAreas: './input/geo/offshore/areas.tsv',
    offshoreArea: {
      // {{ area.meta.name }}
      meta: Festoon.findByParam('offshoreAreas', 'area', 'id'),
      // {{ area.revenues[] }}
      // TODO: Area column should be a 3-letter ID, not name
      revenues: Festoon.transform.filter('offshoreRevenues', function(d) {
        return d.Area === this.area;
      }),
      // {{ area.production[] }}
      // TODO: Area column should be a 3-letter ID, not name
      production: Festoon.transform.filter('offshoreProduction', function(d) {
        return d.Area === this.area;
      })
    },

    // state (onshore) sources
    stateRevenues:      'state/revenues-yearly.tsv',
    stateProduction:    'state/volumes-yearly.tsv',

    // county data sources
    countyRevenues:     'county/by-state/:state/revenues-yearly.tsv',
    allCountyRevenues:  'county/revenues-yearly.tsv',

    // offshore (planning area) sources
    offshoreRevenues:   'offshore/revenues-yearly.tsv',
    offshoreProduction: 'offshore/volumes-yearly.tsv',
  }
});


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

// index
app.get('/', view('index'));

// index
app.get('/resources', view('resources'));
app.get('/resources/:resource',
  data.decorate('resource'),
  view('resource'));

// locations page
app.get('/locations',
  view('locations'));

// redirect /locations/onshore -> /locations
app.get('/locations/onshore', redirect('/locations'));

// state data
app.get('/locations/onshore/:state.json',
  data.decorate('state'),
  api('state'));

// state page
app.get('/locations/onshore/:state/revenues.(csv|json)',
  data.decorate('stateRevenues'),
  api('stateRevenues', {filter: true}));

// state page
app.get('/locations/onshore/:state',
  data.decorate(['state', 'counties']),
  view('state'));

// state page
app.get('/locations/onshore/:state/:county',
  data.decorate(['state', 'county']),
  view('county'));

// offshore area page
app.get('/locations/offshore/:area',
  // XXX: {area: 'offshoreArea'} should work!
  data.decorate('area'),
  view('offshore-area'));

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
