var parse = require('../../lib/parse');
var util = require('../../lib/util');

module.exports = {
  year: 'Calendar Year',
  state: 'State/Offshore Region',
  county: 'CPS/Planning Area',
  fips: 'FIPS Code',
  commodity: function(d) {
    return util.normalizeCommodity(d.Commodity || '');
  },
  product: 'Product',
  product_name: function(d) {
    return parse.units(d.Product)[0];
  },
  units: function(d) {
    return parse.units(d.Product)[1];
  },
  volume: function(d) {
    d = util.trimKeys(d)
    return parse.number(d['Production Volume']);
  }
};
