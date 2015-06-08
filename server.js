#!/usr/bin/env node
require('babel/register');

var Festoon = require('festoon');
var express = require('express');
var cons = require('consolidate');
var extend = require('extend');
var app = express();

var basePath = __dirname;

// render html with nunjucks
app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', basePath + '/views');

var data = new Festoon({
  path: basePath + '/output',
  sources: {
    // master resources (commodities) list, plus other metadata
    resources:  './data/commodities.json',

    // national data sources
    nationalRevenue:    'national/revenues-yearly.tsv',
    nationalProduction: 'national/volumes-yearly.tsv',

    // state data sources
    stateRevenues:      'state/revenues-yearly.tsv',
    stateProduction:    'state/volumes-yearly.tsv',

    // county data sources
    countyRevenues:     'county/by-state/:state/revenues-yearly.tsv',
    allCountyRevenues:  'county/revenues-yearly.tsv',

    // offshore (planning area) data sources
    offshoreRevenues:   'offshore/revenues-yearly.tsv',
    offshoreProduction: 'offshore/volumes-yearly.tsv'
  }
});

// common data
app.use(data.decorate('resources'));

var view = function(template, data) {
  return function(req, res) {
    return data
      ? res.render(template, data)
      : res.render(template);
  };
};

// index
app.get('/', view('index'));

app.listen(process.env.PORT || 4000, function(error) {
  if (error) return console.error('error:', error);
  var listener = this;
  var addr = listener.address();
  console.log('listening @ http://%s:%d', '127.0.0.1', addr.port);
  process.on('exit', function() {
    listener.close();
  });
});
