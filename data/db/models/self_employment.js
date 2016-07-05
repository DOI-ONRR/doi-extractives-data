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
    self_employment: {
      tableName: 'self_employment',

      fields: {
        year: {
          input: 'Year',
          name: 'year',
          type: new sequelize.INTEGER(4).UNSIGNED
        },
        state: {
          input: 'Region',
          name: 'state',
          type: new sequelize.STRING(32)
        },
        extractive_jobs: {
          input: 'Jobs',
          name: 'extractive_jobs',
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
            fields: ['year'],
            unique: true
          }
        ]
      }
    }
  }
};
