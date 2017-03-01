/* jshint node: true */
var parse = require('../../lib/parse');

module.exports = {
  year:         'CY',
  state:        'St',
  county:       'County Name',
  fips:         'FIPS',
  revenue_type: 'Revenue Type',
  commodity:    'Commodity',
  product:      'Product',
  revenue: function(d) {
    return parse.dollars(d.Total);
  }
};
