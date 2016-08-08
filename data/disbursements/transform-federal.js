var parse = require('../../lib/parse');

module.exports = {
  year:   'Fiscal Year',
  fund:   'Fund Type',
  source: 'Source',
  region: function(d) {
    return d.State || 'US';
  },
  dollars: function(d) {
    return parse.dollars(d.Total);
  }
};
