/* jshint node: true, esnext: true */
/* jshint -W106 */
var sequelize = require('sequelize');
var parserHelper = require('../parser-helper');

module.exports = {
  autoparse: false,
  parser: parserHelper(function(input) {
    input.Percent = Number(input.Share) * 100;
    return input;
  }),

  models: {
    bls_employment: {
      tableName: 'bls_employment',

      fields: {
        year: {
          input: 'Year',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        fips: {
          input: 'FIPS',
          name: 'fips',
          type: new sequelize.STRING(5)
        },
        state: {
          input: 'State',
          name: 'state',
          type: new sequelize.STRING(32)
        },
        region_id: {
          name: 'region_id',
          type: new sequelize.STRING(2)
        },
        county: {
          input: 'County',
          name: 'county',
          type: new sequelize.STRING(64)
        },
        extractive_jobs: {
          input: 'Jobs',
          name: 'extractive_jobs',
          type: new sequelize.INTEGER()
        },
        total_jobs: {
          input: 'Total',
          name: 'total_jobs',
          type: new sequelize.INTEGER()
        },
        percent: {
          input: 'Percent',
          name: 'percent',
          type: new sequelize.DECIMAL(3, 2)
        },
      },

      options: {
        indexes: [
          {
            fields: ['fips', 'year'],
            unique: true
          }
        ]
      }
    }
  }
};
