/* jshint node: true, esnext: true */
/* jshint -W106 */
const parse = require('../../lib/parse');
const util = require('../../lib/util');

const VOLUME_COLUMN = 'Sales Volumes';
const REGION_COLUMN = 'Offshore Region';

module.exports = {
  year: 'Calendar Year',
  region: function(d) {
    return util.normalizeOffshoreRegion(d[REGION_COLUMN]);
  },
  planning_area: 'Planning Area',
  offshore_area: 'Offshore Area',
  protraction: 'Protraction',
  commodity: function(d) {
    return util.normalizeCommodity(d.Commodity);
  },
  product: 'Product',
  product_name: function(d) {
    return parse.units(d.Product)[0];
  },
  units: function(d) {
    return parse.units(d.Product)[1];
  },
  volume_type: 'Volume Type',
  volume: function(d) {
    return parse.number(d[VOLUME_COLUMN]);
  }
};
