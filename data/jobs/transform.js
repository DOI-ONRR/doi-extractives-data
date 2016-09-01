module.exports = {
  year:       'Year',
  state:      'State',
  county:     'County',
  fips:       'FIPS',
  region_id:  function() { return null; },
  extractive_jobs: 'Jobs',
  total_jobs: 'Total',
  percent: function(d) {
    return Number(d.Share) * 100;
  }
};
