/* jshint node: true */
var parse = require('../../lib/parse');

module.exports = {
  year:           'CY',
  region:         'Offshore Region',
  planning_area:  function(d) {
    var regionKey = {
      'Pacific': 'Southern California',
      'Gulf of Mexico': 'Western Gulf of Mexico'
    }

    // Some of the Offshore Planning Areas are listed as
    // 'Right of Way'. When this is the case, associate it
    // with the appropriate area.
    return d['Offshore Planning Area'].match(/Right of Way$/)
      ? regionKey[d['Offshore Region']]
      : d['Offshore Planning Area'];
  },
  block_name:     'BOEM Block Name',
  protraction:    'BOEM Protraction',
  revenue_type:   'Revenue Type',
  commodity:      'Commodity',
  product:        'Product',
  revenue: function(d) {
    return parse.dollars(d.Total);
  }
};
