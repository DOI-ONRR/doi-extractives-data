/* jshint node: true, esnext: true */
/* jshint -W106 */
var sequelize = require('sequelize');
var parse = require('../../../lib/parse');
var util = require('../../../lib/util');
var parserHelper = require('../parser-helper');

const REVENUE_COLUMN = 'Royalty/Revenue';

module.exports = {
  autoparse: false,
  parser: parserHelper(function(input) {
    input.Revenue = parse.dollars(input[REVENUE_COLUMN]);
    input.Commodity = util.normalizeCommodity(input.Commodity);
    return input;
  }),

  models: {
    county_revenue: {
      tableName: 'county_revenue',

      fields: {
        year: {
          input: 'CY',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        state: {
          input: 'St',
          name: 'state',
          type: new sequelize.STRING(2)
        },
        county: {
          input: 'County Name',
          name: 'county',
          type: new sequelize.STRING(32)
        },
        fips: {
          input: 'FIPS',
          name: 'fips',
          type: new sequelize.INTEGER(5).UNSIGNED.ZEROFILL
        },
        commodity: {
          input: 'Commodity',
          name: 'commodity',
          type: new sequelize.STRING(32)
        },
        product: {
          input: 'Product',
          name: 'product',
          type: new sequelize.STRING(64)
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
      }
    }
  }
};
