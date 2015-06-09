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

// positional arguments
var argc = options._;

var express = require('express');
var cons = require('consolidate');
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
app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

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

    county: {
      name: function(params, done) {
        return done(null, params.county);
      },
      revenues: Festoon.transform.filter('countyRevenues', function(d) {
        return d.County === this.county;
      })
    },

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
      production: Festoon.transform.filter('stateProduction', function(d) {
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
  next();
}, data.decorate(['resources', 'locations']));

// static assets
app.use('/static', express.static(__dirname + '/static'));
app.use('/data', express.static(__dirname + '/output'));

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
  data.decorate('state'),
  view('state'));

// state page
app.get('/locations/onshore/:state/:county',
  data.decorate(['state', 'county']),
  view('county'));

// offshore area page
app.get('/locations/offshore/:area',
  data.decorate({area: 'offshoreArea'}),
  view('offshore-area'));

app.listen(process.env.PORT || 4000, function(error) {
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
