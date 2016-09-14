var parse = require('../../lib/parse');
var fundMap = {
  // map "State" -> "States"
  'State': 'States'
};

module.exports = {
  year:   'FY',
  fund: function(d) {
    var fund = d['Fund'];
    return fundMap[fund] || fund.replace(/ - GOMESA\s*$/, '');
  },
  source: 'Source',
  region: function(d) {
    return d.State;
  },
  dollars: function(d) {
    return parse.dollars(d.Total);
  }
};
