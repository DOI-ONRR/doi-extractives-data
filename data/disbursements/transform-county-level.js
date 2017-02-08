'use strict';
const parse = require('../../lib/parse');

const FUND_MAP = {
  'State': 'States',
};

const GOMESA_PATTERN = / - GOMESA\s*$/;

module.exports = {
  year: 'FY',
  fund: d => {
    const fund = d.Fund;
    return FUND_MAP[fund] || fund.replace(GOMESA_PATTERN, '');
  },
  source: 'Source',
  region: 'State',
  county: 'County',
  dollars: d => parse.dollars(d.Total),
};
