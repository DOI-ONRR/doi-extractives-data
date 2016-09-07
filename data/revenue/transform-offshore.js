var parse = require('../../lib/parse');

module.exports = {
  year:           'Calendar Year',
  region:         'Offshore Region',
  planning_area:  'Planning Area',
  offshore_area:  'Offshore Area',
  protraction:    'Protraction',
  revenue_type:   'Revenue Type',
  commodity:      'Commodity',
  product:        'Product',
  revenue: function(d) {
    return parse.dollars(d.Total);
  }
};
