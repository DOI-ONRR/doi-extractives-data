/* jshint node: true, esnext: true */
/* jshint -W106 */
const parse = require('../../lib/parse');

const VOLUME_COLUMN = 'Production (short tons)';

module.exports = {
  year:             'Year',
  state:            'Mine State',
  county:           'Mine County',
  mine_type:        'Mine Type',
  mine_status:      'Mine Status',
  operation_type:   'Operation Type',
  company_name:     'Operating Company',
  company_type:     'Company Type',
  company_address:  'Operating Company Address',

  volume: function(d) {
    return parse.number(d[VOLUME_COLUMN]) * 1000;
  },
  units: function() { return 'short tons'; },
  average_employees: function(d) {
    return parse.number(d['Average Employees']);
  },
  labor_hours: function(d) {
    return parse.number(d['Labor Hours']);
  }
};
