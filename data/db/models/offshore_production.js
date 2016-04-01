/* jshint node: true, esnext: true */
/* jshint -W106 */
var sequelize = require('sequelize');
var parse = require('../../../lib/parse');
var util = require('../../../lib/util');
var parserHelper = require('../parser-helper');

const VOLUME_COLUMN = 'Sales Volumes';
const REGION_COLUMN = 'Offshore Region';

module.exports = {
  autoparse: false,
  parser: parserHelper(function(input) {
    input.Volume = parse.number(input[VOLUME_COLUMN]);
    input.Region = util.normalizeOffshoreRegion(input[REGION_COLUMN]);
    input.Commodity = util.normalizeCommodity(input.Commodity);
    return input;
  }),

  models: {
    offshore_production: {
      tableName: 'offshore_production',

      fields: {
        year: {
          input: 'Calendar Year',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        region: {
          input: REGION_COLUMN,
          name: 'region',
          type: new sequelize.STRING(32)
        },
        planning_area: {
          input: 'Planning Area',
          name: 'planning_area',
          type: new sequelize.STRING(32)
        },
        offshore_area: {
          input: 'Offshore Area',
          name: 'offshore_area',
          type: new sequelize.STRING(32)
        },
        protraction: {
          input: 'Protraction',
          name: 'protraction',
          type: new sequelize.STRING(8)
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
