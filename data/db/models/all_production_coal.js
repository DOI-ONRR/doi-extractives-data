/* jshint node: true, esnext: true */
/* jshint -W106 */
var sequelize = require('sequelize');
var parse = require('../../../lib/parse');
var util = require('../../../lib/util');
var parserHelper = require('../parser-helper');

const VOLUME_COLUMN = 'Production (short tons)';
const NUMERIC_COLUMNS = [
  VOLUME_COLUMN,
  'Average Employees',
  'Labor Hours'
];

module.exports = {
  autoparse: false,
  parser: parserHelper(function(input) {
    // console.warn('row:', input);
    NUMERIC_COLUMNS.forEach(function(column) {
      input[column] = parse.number(input[column] || '');
    });
    return input;
  }),

  models: {
    all_production_coal: {
      tableName: 'all_production_coal',
      fields: {
        year: {
          input: 'Year',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        state: {
          input: 'Mine State',
          name: 'state',
          type: new sequelize.STRING(2)
        },
        county: {
          input: 'Mine County',
          name: 'county',
          type: new sequelize.STRING(32)
        },
        mine_type: {
          input: 'Mine Type',
          name: 'mine_type',
          type: new sequelize.STRING(40),
        },
        mine_status: {
          input: 'Mine Status',
          name: 'mine_status',
          type: new sequelize.STRING(40),
        },
        operation_type: {
          input: 'Operation Type',
          name: 'operation_type',
          type: new sequelize.STRING(32)
        },
        company_name: {
          input: 'Operating Company',
          name: 'company_name',
          type: new sequelize.STRING(32)
        },
        company_type: {
          input: 'Company Type',
          name: 'company_type',
          type: new sequelize.STRING(32)
        },
        company_address: {
          input: 'Operating Company Address',
          name: 'company_address',
          type: new sequelize.TEXT()
        },
        volume: {
          input: VOLUME_COLUMN,
          name: 'volume',
          type: new sequelize.DECIMAL(12, 2)
        },
        average_employees: {
          input: 'Average Employees',
          name: 'average_employees',
          type: new sequelize.INTEGER()
        },
        labor_hours: {
          input: 'Labor Hours',
          name: 'labor_hours',
          type: new sequelize.INTEGER()
        },
      }
    }
  }
};
