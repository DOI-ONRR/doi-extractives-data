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

const context = {};

const fetchCommodity = function(commodity, next) {
  const source = commodities[commodity];
  const params = Object.assign({}, API_BASE_PARAMS, source.params);
  const series = params.series_id;
  console.warn('fetching commodity:', commodity, 'from', series);

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

      // console.warn('fetching:', url);
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
      } else if (rows.length) {
        console.warn('writing %d rows to:', rows.length, file);
        streamify(rows)
          .pipe(tito.createWriteStream('tsv'))
          .pipe(fs.createWriteStream(file, 'utf8'))
          .on('end', next);
      } else {
        console.warn('no rows found for', commodity);
      }
    }
  ); // fetchRegion
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
