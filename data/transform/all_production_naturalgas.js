var regions = 'AK,AR,CA,pacific,CO,gulf,KS,LA,MT,NM,ND,OH,OK,PA,TX,UT,WV,WY'
  .split(',');

module.exports = function(d) {
  return regions.map(function(region) {
    return {
      year: d.Year,
      region: region,
      volume: d[region]
    };
  });
};
