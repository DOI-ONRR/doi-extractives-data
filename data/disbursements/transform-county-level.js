'use strict';
var parse = require('../../lib/parse');

var FUND_MAP = {
  'State': 'States',
};

var SUFFIX_PATTERN = /( Fund)?( - GOMESA)?$/i;

module.exports = {
  year: 'FY',
  fund: function(d) {
    var fund = d.Fund;
    return FUND_MAP[fund] || fund.replace(SUFFIX_PATTERN, '');
  },
  source: 'Source',
  region: 'State',
  county: 'County',
  dollars: function(d) {
    return parse.dollars(d.Total);
  },
};
