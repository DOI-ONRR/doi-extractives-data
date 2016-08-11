var parse = require('../../lib/parse');
var fundMap = {
  // map "State" -> "States"
  'State': 'States'
};

module.exports = {
  year:   'Fiscal Year',
  fund: function(d) {
    var fund = d['Fund Type'];
    return fundMap[fund] || fund;
  },
  source: 'Source',
  region: function(d) {
    return d.State;
  },
  dollars: function(d) {
    return parse.dollars(d.Total);
  }
};
