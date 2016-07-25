var regions = 'FL,NY,PA,VA,WV,IL,IN,KS,KY,MI,MO,NE,ND,OH,OK,SD,TN,AL,AR,LA,MS,NM,TX,gulf,CO,MT,UT,WY,AK,,AZ,CA,NV,pacific alaska'
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
