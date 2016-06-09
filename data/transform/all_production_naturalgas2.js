var regions = 'AL,AZ,FL,IL,IN,KY,MD,MI,MS,MO,NE,NV,NY,OR,SD,TN,VA'
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
