'use strict';
var parse = require('../../lib/parse');

var FUND_MAP = {
  'State': 'States',
};

var SOURCE_MAP = {
  'OffShore': 'Offshore',
};

var SUFFIX_PATTERN = /( Fund)?( - GOMESA)?$/i;

module.exports = {
  year: 'FY',
  fund: function(d) {
    var fund = d.Fund;
    return FUND_MAP[fund] || fund.replace(SUFFIX_PATTERN, '');
  },
  source: function(d) {
    var source = d.Source;
    return SOURCE_MAP[source] || source;
  },
  region: 'State',
  county: 'County',
  dollars: function(d) {
    return parse.dollars(d.Total);
  },
};
