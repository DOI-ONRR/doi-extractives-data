var parse = require('../../lib/parse');

module.exports = {
  state: 'State',
  state_acres: function(d) {
    return parse.number(d['Total Acreage in State']);
  },
  federal_acres: function(d) {
    return parse.number(d['Total Federal Acreage']);
  },
  federal_percent: function(d) {
    return parse.percent(d['% of State']);
  }
};
