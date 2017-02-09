'use strict';
var parse = require('../../lib/parse');

var FUND_MAP = {
  'State': 'States',
};

var GOMESA_PATTERN = / - GOMESA\s*$/i;

module.exports = {
  year: 'FY',
  fund: function(d) {
    const fund = d.Fund;
    return FUND_MAP[fund] || fund.replace(GOMESA_PATTERN, '');
  },
  source: 'Source',
  region: 'State',
  county: 'County',
  dollars: function(d) {
    return parse.dollars(d.Total);
  },
};
