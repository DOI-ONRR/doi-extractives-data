const STATE = process.env.STATE;
const YEAR = 2014;
const parse = require('../../../lib/parse');

if (!STATE) {
  throw new Error('this transform requires the STATE env var to be set');
}

// columns that *don't* represent a destination fund
const FIXED_COLUMNS = [
  'Revenue Stream',
  'Type'
];

module.exports = function(row) {
  return Object.keys(row)
    .filter(function(key) {
      return FIXED_COLUMNS.indexOf(key) === -1;
    })
    .map(function(key) {
      return {
        state:  STATE,
        year:   YEAR,
        source: row['Revenue Stream'],
        type:   row.Type,
        dest:   key,
        dollars: parse.dollars(row[key])
      };
    })
    .filter(function(d) {
      return d.dollars > 0;
    });
};
