var parse = require('../../../../lib/parse');

module.exports = {
  year:   'Fiscal Year',
  fund:   'Fund Type',
  source: 'Source',
  state:  'State',
  dollars: function(d) {
    return parse.dollars(d.Total);
  }
};
