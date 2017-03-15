// XXX state gets passed in as an environment variable
var STATE = process.env.STATE;
if (!STATE) {
  throw new Error('this transform requires the STATE env var to be set');
}

// FIXME: where does this come from?
var parse = require('../../../lib/parse');

var SOURCE_COLUMN = 'Revenue Stream';

// columns that *don't* represent a destination fund
var FIXED_COLUMNS = [
  SOURCE_COLUMN,
  'Year',
  'Year Type',
  'Source',
  'Type',
];

/**
 * @param {Object} input row
 * @return {Array<Object>} one row per "destination" or disbursement
 */
module.exports = function(row) {
  return Object.keys(row)
    .filter(function(key) {
      return FIXED_COLUMNS.indexOf(key) === -1;
    })
    .map(function(key) {
      return {
        state:  STATE,
        year:   row.Year,
        source: row[SOURCE_COLUMN],
        type:   row.Type,
        dest:   key,
        dollars: parse.dollars(row[key])
      };
    })
    .filter(function(d) {
      return d.dollars > 0;
    });
};
