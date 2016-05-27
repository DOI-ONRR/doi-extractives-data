var years;

module.exports = function(d) {
  if (!years) {
    years = Object.keys(d).filter(function(key) {
      return key.match(/^\d{4}$/);
    });
  }
  return years.map(function(year) {
    return {
      year: year,
      state: d.State,
      source: d.Source,
      volume: +d[year]
    };
  })
  .filter(function(d) {
    return d.volume;
  });
};
