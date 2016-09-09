/* jshint node: true */
var parse = require('../../lib/parse');

module.exports = {
  year:         'FY',
  state:        'St',
  county:       'County Name',
  fips:         'FIPS',
  revenue_type: 'Revenue Type',
  lease_type:   'Mineral Lease Type',
  commodity:    'Commodity',
  product:      'Product',
  revenue: function(d) {
    return parse.dollars(d.Total);
  }
};
