/* jshint node: true, esnext: true */
/* jshint -W106 */
var sequelize = require('sequelize');
var parse = require('../../../lib/parse');
var util = require('../../../lib/util');
var parserHelper = require('../parser-helper');

const YEAR = process.env.COMPANY_YEAR;

module.exports = {
  autoparse: false,
  parser: parserHelper(function(input) {
    input.Year = YEAR;
    input.Revenue = parse.dollars(input.Revenue);
    input.Commodity = util.normalizeCommodity(input.Commodity);
    return input;
  }),

  models: {
    company_revenue: {
      tableName: 'company_revenue',

      fields: {
        year: {
          input: 'Year',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        company: {
          input: 'Company',
          name: 'company',
          type: new sequelize.STRING(64)
        },
        commodity: {
          input: 'Commodity',
          name: 'commodity',
          type: new sequelize.STRING(32)
        },
        revenue_type: {
          input: 'Revenue Type',
          name: 'revenue_type',
          type: new sequelize.STRING(32)
        },
        revenue: {
          input: 'Revenue',
          name: 'revenue',
          type: new sequelize.DECIMAL(12, 2)
        },
      },

      options: {
        indexes: [
          {
            fields: ['year', 'company', 'commodity', 'revenue_type'],
            unique: true
          }
        ]
      }
    }
  }
};
