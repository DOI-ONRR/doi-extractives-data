/* jshint node: true */
/* jshint -W106 */
var parse = require('../../lib/parse');
var util = require('../../lib/util');

var YEAR = process.env.COMPANY_YEAR;

module.exports = {
  year: function() { return YEAR; },
  company: 'Company',
  commodity: function(d) {
    return util.normalizeCommodity(d.Commodity);
  },
  revenue_type: 'Revenue Type',
  revenue: function(d) {
    return parse.dollars(d.Revenue);
  }
};
