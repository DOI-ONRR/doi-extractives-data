/* jshint node: true */
var parse = require('../../lib/parse');

module.exports = {
  year:         'FY',
  revenue_type: 'Revenue Type',
  commodity:    'Commodity',
  product:      'Product',
  revenue:      function(d) {
    return parse.dollars(d.Revenue);
  }
};
