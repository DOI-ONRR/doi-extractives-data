module.exports = d => {
  // pass through the other fields, and create columns for the following
  // ones with types that match these values:
  d.region_id = 'XX';
  // this is a trick to coerce the FIPS codes to strings;
  d.fips = 'FIPS' + d.fips;
  return d;
};
