#!/usr/bin/env node
const async = require('async');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const request = require('request');
const streamify = require('stream-array');
const thru = require('through2').obj;
const tito = require('tito');
const util = require('../../lib/util');

const STATES_CSV_PATH = '../_input/geo/states.csv';

const API_BASE_URL = 'http://api.eia.gov/series/';
const API_BASE_PARAMS = {
  api_key: process.env.EIA_API_KEY,
  start: 2006,
  end: 2015,
  out: 'json'
};

// where to write commodity-specific files
const OUTPUT_FILENAME_TEMPLATE = 'commodity/{commodity}.tsv';

const commodities = {

  'coal': {
    values: {
      commodity: 'Coal'
    },
    params: {
      series_id: 'COAL.PRODUCTION.TOT-{region}-TOT.A'
    }
  },

  'oil': {
    values: {
      commodity: 'Oil'
    },
    params: {
      series_id: 'PET.MCRFP{region}1.A'
    }
  },

  'naturalgas': {
    values: {
      commodity: 'Gas'
    },
    params: {
      series_id: 'NG.N9010{region}2.A'
    }
  },

  'renewables': {
    values: {
      commodity: 'Renewable Energy'
    },
    params: {
      series_id: 'SEDS.REPRB.{region}.A'
    }
  },

  'biofuels': {
    values: {
      commodity: 'Biofuels'
    },
    params: {
      series_id: 'TOTAL.BFPRB{region}.A'
    }
  },

  'geothermal': {
    values: {
      commodity: 'Geothermal'
    },
    params: {
      series_id: 'TOTAL.GETCB{region}.A'
    }
  },

  'hydroelectric': {
    values: {
      commodity: 'Hydroelectric'
    },
    params: {
      series_id: 'TOTAL.HVTCB{region}.A'
    }
  },

  'solar': {
    values: {
      commodity: 'Solar'
    },
    params: {
      series_id: 'TOTAL.SOTCB{region}.A'
    }
  },

  'wind': {
    values: {
      commodity: 'Wind'
    },
    params: {
      series_id: 'TOTAL.WYTCB{region}.A'
    }
  },

};

async.waterfall([
  function loadStates(next) {
    util.readData(
      STATES_CSV_PATH,
      tito.createReadStream('csv'),
      next
    );
  },

  function updateContext(states, next) {
    const regions = states.map(function(d) { return d.abbr; });
    regions.unshift('US');
    next(null, {regions: regions});
  },

  function fetchCommmodities(context, next) {
    async.map(Object.keys(commodities), function fetchCommodity(commodity, next) {
      const source = commodities[commodity];
      const params = Object.assign({}, API_BASE_PARAMS, source.params);
      const series = params.series_id;

      const file = OUTPUT_FILENAME_TEMPLATE.replace('{commodity}', commodity);
      const rows = [];

      async.mapSeries(
        context.regions,
        function fetchRegion(region, done) {
          params.series_id = series.replace('{region}', region);
          const url = [API_BASE_URL, qs.stringify(params)].join('?');
          const values = Object.assign(
            {commodity: commodity, region: region},
            source.values
          );

          console.warn('fetching:', url);
          request(url)
            .on('error', done)
            .pipe(tito.createReadStream('json', {
              path: '.series.*'
            }))
            .on('data', function(series) {
              if (!values.units) {
                values.units = series.unitsshort || series.units;
              }

              values.region = region;
              series.data.forEach(function(d) {
                rows.push(Object.assign({
                  year:   d[0],
                  volume: d[1]
                }, values));
              }, this);
            })
            .on('end', done);
        },
        function(error) {
          if (error) {
            return next(error);
          } else {
            console.warn('writing %d rows to:', rows.length, file);
            streamify(rows)
              .pipe(tito.createWriteStream('tsv'))
              .pipe(fs.createWriteStream(file, 'utf8'))
              .on('end', next);
          }
        }
      ); // fetchRegion

    }, next); // fetchCommodity
  }
], function(error) {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.warn('all done!');
  }
});
