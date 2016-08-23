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
      commodity: 'Crude Oil'
    },
    params: {
      series_id: 'PET.MCRFP{region}1.A'
    }
  },

  'offshore-oil': {
    values: {
      commodity: 'Crude Oil'
    },
    params: {
      series_id: {
        'PET.MCRFP3FM1.A': {
          region: 'GOM'
        },
        'PET.MCRFP5F1.A': {
          region: 'SOC'
        }
      }
    }
  },

  'naturalgas': {
    values: {
      commodity: 'Natural Gas'
    },
    params: {
      series_id: 'NG.N9010{region}2.A'
    }
  },

  /*
  // XXX this is the total renewable energy production
  'renewables': {
    values: {
      commodity: 'Renewable Energy'
    },
    params: {
      series_id: 'SEDS.REPRB.{region}.A'
    }
  },
  */

  /*
  // XXX this category is no longer listed on the EIA site
  'biomass': {
    values: {
      commodity: 'Biomass (total)'
    },
    params: {
      series_id: 'ELEC.GEN.BIO-{region}-99.A'
    }
  },
  */

  'geothermal': {
    values: {
      commodity: 'Geothermal',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.GEO-{region}-99.A'
    }
  },

  'hydroelectric': {
    values: {
      commodity: 'Conventional Hydroelectric',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.HYC-{region}-99.A'
    }
  },

  'solar': {
    values: {
      commodity: 'Solar',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.SUN-{region}-99.A'
    }
  },

  'wind': {
    values: {
      commodity: 'Wind',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.WND-{region}-99.A'
    }
  },

  'wood': {
    values: {
      commodity: 'Wood and wood-derived fuels'
    },
    params: {
      series_id: 'ELEC.GEN.WWW-{region}-99.A'
    }
  },

  'other-biomass': {
    values: {
      commodity: 'Other biomass'
    },
    params: {
      series_id: 'ELEC.GEN.WAS-{region}-99.A'
    }
  },

  /*
  // XXX: we're removing this, per #1574
  'other-renewables': {
    values: {
      commodity: 'All Other Renewables'
    },
    params: {
      series_id: 'ELEC.GEN.AOR-{region}-99.A'
    }
  },
  */

};

var requestedCommodityKeys = process.argv.slice(2);
if (requestedCommodityKeys.length) {
  for (var key in commodities) {
    if (requestedCommodityKeys.indexOf(key) == -1) {
      delete commodities[key];
    }
  }
  if (Object.keys(commodities).length === 0) {
    console.error('no commodities found matching:', requestedCommodityKeys.join(', '));
    process.exit(1);
  }
  console.warn('only generating keys:', Object.keys(commodities).join(', '));
  // process.exit(0);
}

const context = {};

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

const fetchCommodity = function(commodity, next) {
  const source = commodities[commodity];
  const params = Object.assign({}, API_BASE_PARAMS, source.params);
  const series = params.series_id;
  console.warn('fetching commodity:', commodity, 'from', series);

  const file = OUTPUT_FILENAME_TEMPLATE.replace('{commodity}', commodity);
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
      console.warn('no rows found for', commodity);
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
          {commodity: commodity},
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
      context.regions,
      function fetchRegion(region, done) {
        params.series_id = series.replace('{region}', region);
        const values = Object.assign(
          {
            commodity:  commodity,
            region:     region
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
      commodity: commodity
    }, source.values), function(error, series) {
      rows = series;
      finish(error);
    });

  }

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
    context.regions = states.map(function(d) { return d.abbr; });
    context.regions.unshift('US');
    next();
  },

  function fetchCommmodities(next) {
    async.map(Object.keys(commodities), fetchCommodity, next);
  }
], function(error) {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.warn('all done!');
  }
});
