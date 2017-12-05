#!/usr/bin/env node
'use strict';
const async = require('async');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const request = require('request');
const streamify = require('stream-array');
const thru = require('through2').obj;
const tito = require('tito');
const util = require('../../lib/util');
const yaml = require('js-yaml');

const API_BASE_URL = 'http://api.eia.gov/series/';
const API_KEY = process.env.EIA_API_KEY;
if (!API_KEY) {
  console.error('You must set the EIA_API_KEY environment variable:');
  console.error('\n    export EIA_API_KEY=XXXXXX\n');
  console.error('or:\n\n    EIA_API_KEY=XXXXXX ./update.js\n');
  process.exit(1);
}

const API_BASE_PARAMS = {
  api_key: API_KEY,
  out: 'json'
};

// where to write product-specific files
const OUTPUT_FILENAME_TEMPLATE = __dirname + '/product/{product}.tsv';

var config;

const fetchSeries = function(params, values, done) {
  const url = [API_BASE_URL, qs.stringify(params)].join('?');
  const series = [];
  console.warn('fetching:', url);
  request(url)
    .on('error', done)
    .pipe(tito.createReadStream('json', {
      path: '.series.*'
    }))
    .on('data', function(d) {
      // console.warn('data:', d);
      values.series_id = d.series_id;
      if (!values.units) {
        values.units = d.unitsshort || d.units;
      }
      d.data.forEach(function(s) {
        series.push(Object.assign({
          year:   s[0],
          volume: s[1]
        }, values));
      }, this);
    })
    .on('end', function() {
      done(null, series);
    });
};

const fetchProduct = function(product, next) {
  const source = config.products[product];
  const params = Object.assign(
    {},
    API_BASE_PARAMS,
    config.params,
    source.params
  );
  const series = source.series;
  console.warn('fetching product:', product, 'from', series);

  const file = OUTPUT_FILENAME_TEMPLATE.replace('{product}', product);
  var rows = [];

  const finish = function(error) {
    if (error) {
      return next(error);
    } else if (rows.length) {
      console.warn('writing %d rows to:', rows.length, file);
      streamify(rows)
        .pipe(tito.createWriteStream('tsv'))
        .pipe(fs.createWriteStream(file, 'utf8'))
        .on('end', next);
    } else {
      console.warn('no rows found for', product);
    }
  };

  if (typeof series === 'object') {

    /*
     * if series is an object, then it's assumed to have the following
     * structure:
     *
     * {
     *   'series_id': { values }
     * }
     */
    async.mapSeries(
      Object.keys(series),
      function fetchSubSeries(series_id, done) {
        params.series_id = series_id;
        const values = Object.assign(
          {product: product},
          source.values,
          series[series_id]
        );

        fetchSeries(params, values, function(error, series) {
          if (error) return done(error);
          rows = rows.concat(series);
          done();
        });
      },
      finish
    );

  } else if (series.indexOf('{region}') > -1) {

    /*
     * If the series contains a '{region}' placeholder, then we should
     * substitute it with each of the known region identifiers and
     * concatenate the resulting series together.
     */
    async.mapSeries(
      config.regions,
      function fetchRegion(region, done) {
        params.series_id = series.replace('{region}', region);
        const values = Object.assign(
          {
            product: product,
            region: region
          },
          source.values
        );

        fetchSeries(params, values, function(error, series) {
          if (error) return done(error);
          rows = rows.concat(series);
          done();
        });
      },
      finish
    );

  } else {

    /*
     * otherwise, just fetch that series as-is and treat the result as the
     * entire dataset.
     */
    fetchSeries(params, Object.assign({
      product: product
    }, source.values), function(error, series) {
      rows = series;
      finish(error);
    });

  }

};

async.waterfall([
  function loadConfig(next) {
    const configPath = path.join(__dirname, 'config.yml');
    console.warn('loading config:', configPath);
    fs.readFile(
      configPath, 'utf8',
      function(error, buffer) {
        if (error) return next(error);
        config = yaml.safeLoad(buffer);
        console.warn('config loaded...', config.products);
        next();
      }
    );
  },

  function prepProducts(next) {
    const products = config.products;

    var productKeys = process.argv.slice(2);
    if (productKeys.length) {
      for (var key in products) {
        if (productKeys.indexOf(key) == -1) {
          delete products[key];
        }
      }
      if (Object.keys(products).length === 0) {
        console.error('no products found matching:', productKeys.join(', '));
        process.exit(1);
      }
      console.warn('only generating keys:', Object.keys(products).join(', '));
      // process.exit(0);
    }

    next();
  },

  function fetchCommmodities(next) {
    async.map(Object.keys(config.products), fetchProduct, next);
  }
], function(error) {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.warn('all done!');
  }
});
