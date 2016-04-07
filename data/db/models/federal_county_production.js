/* jshint node: true, esnext: true */
/* jshint -W106 */
var sequelize = require('sequelize');
var parse = require('../../../lib/parse');
var util = require('../../../lib/util');
var parserHelper = require('../parser-helper');

const VOLUME_COLUMN = 'Production Volume';

module.exports = {
  autoparse: false,
  parser: parserHelper(function(input) {
    input.Volume = parse.number(input[VOLUME_COLUMN]);
    input.Commodity = util.normalizeCommodity(input.Commodity || '');
    return input;
  }),

  models: {
    federal_county_production: {
      tableName: 'federal_county_production',
      fields: {
        year: {
          input: 'Year',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        state: {
          input: 'Region',
          name: 'state',
          type: new sequelize.STRING(2)
        },
        county: {
          input: 'Area',
          name: 'county',
          type: new sequelize.STRING(32)
        },
        fips: {
          input: 'FIPS',
          name: 'fips',
          type: new sequelize.INTEGER(5).UNSIGNED.ZEROFILL
        },
        commodity: {
          name: 'commodity',
          type: new sequelize.STRING(32)
        },
        product: {
          input: 'Product',
          name: 'product',
          type: new sequelize.STRING(64)
        },
        volume_type: {
          input: 'Volume Type',
          name: 'volume_type',
          type: new sequelize.STRING(32)
        },
        volume: {
          input: 'Volume',
          name: 'volume',
          type: new sequelize.DECIMAL(12, 2)
        },
      }
    }
  }
};
