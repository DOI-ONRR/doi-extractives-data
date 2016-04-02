/* jshint node: true, esnext: true */
/* jshint -W106 */
var sequelize = require('sequelize');
var parserHelper = require('../parser-helper');

module.exports = {
  autoparse: false,
  parser: parserHelper(function(input) {
    return input;
  }),

  models: {
    bls_employment: {
      tableName: 'bls_employment',

      fields: {
        fips: {
          input: 'area_fips',
          name: 'fips',
          type: new sequelize.STRING(5)
        },
        year: {
          input: 'year',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        region: {
          input: 'area_title',
          name: 'region',
          type: new sequelize.STRING(64)
        },
        annual_avg_empl: {
          input: 'annual_avg_emplvl',
          name: 'annual_avg_empl',
          type: new sequelize.INTEGER()
        },
        annual_total_wages: {
          input: 'total_annual_wages',
          name: 'annual_total_wages',
          type: new sequelize.INTEGER()
        },
        annual_taxable_wages: {
          input: 'taxable_annual_wages',
          name: 'annual_taxable_wages',
          type: new sequelize.INTEGER()
        },
        annual_avg_wages: {
          input: 'avg_annual_pay',
          name: 'annual_avg_wages',
          type: new sequelize.INTEGER()
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
