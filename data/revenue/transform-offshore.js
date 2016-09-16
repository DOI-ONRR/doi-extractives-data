/* jshint node: true */
var parse = require('../../lib/parse');

module.exports = {
  year:           'CY',
  region:         'Offshore Region',
  planning_area:  'Offshore Planning Area',
  block_name:     'BOEM Block Name',
  protraction:    'BOEM Protraction',
  revenue_type:   'Revenue Type',
  commodity:      'Commodity',
  product:        'Product',
  revenue: function(d) {
    return parse.dollars(d.Total);
  }
};
