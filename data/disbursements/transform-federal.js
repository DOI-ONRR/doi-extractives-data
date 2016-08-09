var parse = require('../../lib/parse');
var fundMap = {
  // map "States" -> "State"
  'States': 'State'
};

module.exports = {
  year:   'Fiscal Year',
  fund: function(d) {
    var fund = d['Fund Type'];
    return fundMap[fund] || fund;
  },
  source: 'Source',
  region: function(d) {
    return d.State || 'US';
  },
  dollars: function(d) {
    return parse.dollars(d.Total);
  }
};
