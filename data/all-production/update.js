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

// where to write product-specific files
const OUTPUT_FILENAME_TEMPLATE = 'product/{product}.tsv';

const products = {

  'coal': {
    values: {
      product: 'Coal'
    },
    params: {
      series_id: 'COAL.PRODUCTION.TOT-{region}-TOT.A'
    }
  },

  'oil': {
    values: {
      product: 'Crude Oil'
    },
    params: {
      series_id: 'PET.MCRFP{region}1.A'
    }
  },

  'offshore-oil': {
    values: {
      product: 'Crude Oil'
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
      product: 'Natural Gas'
    },
    params: {
      series_id: 'NG.N9010{region}2.A'
    }
  },

  /*
  // XXX this data is unusable because it ends in 2006.
  'offshore-naturalgas': {
    values: {
      product: 'Natural Gas'
    },
    params: {
      series_id: {
        'NG.RNGR20R3FM_1.A': {
          region: 'GOM'
        }
      }
    }
  },
  */

  /*
  // XXX this is the total renewable energy production
  'renewables': {
    values: {
      product: 'Renewable Energy'
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
      product: 'Biomass (total)'
    },
    params: {
      series_id: 'ELEC.GEN.BIO-{region}-99.A'
    }
  },
  */

  'geothermal': {
    values: {
      product: 'Geothermal',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.GEO-{region}-99.A'
    }
  },

  'hydroelectric': {
    values: {
      product: 'Conventional Hydroelectric',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.HYC-{region}-99.A'
    }
  },

  'solar': {
    values: {
      product: 'Solar',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.SUN-{region}-99.A'
    }
  },

  'wind': {
    values: {
      product: 'Wind',
      units: 'MMWh'
    },
    params: {
      series_id: 'ELEC.GEN.WND-{region}-99.A'
    }
  },

  'wood': {
    values: {
      product: 'Wood and wood-derived fuels'
    },
    params: {
      series_id: 'ELEC.GEN.WWW-{region}-99.A'
    }
  },

  'other-biomass': {
    values: {
      product: 'Other biomass'
    },
    params: {
      series_id: 'ELEC.GEN.WAS-{region}-99.A'
    }
  },

  /*
  // XXX: we're removing this, per #1574
  'other-renewables': {
    values: {
      product: 'All Other Renewables'
    },
    params: {
      series_id: 'ELEC.GEN.AOR-{region}-99.A'
    }
  },
  */

};

var requestedCommodityKeys = process.argv.slice(2);
if (requestedCommodityKeys.length) {
  for (var key in products) {
    if (requestedCommodityKeys.indexOf(key) == -1) {
      delete products[key];
    }
  }
  if (Object.keys(products).length === 0) {
    console.error('no products found matching:', requestedCommodityKeys.join(', '));
    process.exit(1);
  }
  console.warn('only generating keys:', Object.keys(products).join(', '));
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

const fetchCommodity = function(product, next) {
  const source = products[product];
  const params = Object.assign({}, API_BASE_PARAMS, source.params);
  const series = params.series_id;
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
      context.regions,
      function fetchRegion(region, done) {
        params.series_id = series.replace('{region}', region);
        const values = Object.assign(
          {
            product:  product,
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
      product: product
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
    async.map(Object.keys(products), fetchCommodity, next);
  }
], function(error) {
  if (error) {
    console.error(error);
    return process.exit(1);
  } else {
    console.warn('all done!');
  }
});
