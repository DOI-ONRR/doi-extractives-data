module.exports = d => {
  // pass through the other fields, and create columns for the following
  // ones with types that match these values:
  d.region_id = 'XX';
  return d;
};
