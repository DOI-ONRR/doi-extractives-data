const parse = require('../../lib/parse');

const SOURCE_COLUMN = 'States/Territories (alpha by Postal Code)';
const regionPattern = /^\s*[A-Z]{2}\s*$/;
const sourcePattern = /^(\d{4}) (.+)$/;

var regions;

module.exports = function(d) {
  // ignore empty rows
  if (!d[SOURCE_COLUMN]) {
    return;
  }

  if (!regions) {
    regions = Object.keys(d)
      .filter(function(key) {
        return key.match(regionPattern);
      });
  }

  var source = d[SOURCE_COLUMN];
  var match = source.match(sourcePattern);
  var year;
  if (match) {
    year = match[1];
    source = match[2];
  }

  return regions.map(function(region) {
    return {
      year: year,
      source: source,
      state: region.trim(),
      dollars: parse.dollars(d[region])
    };
  })
  .filter(function(d) {
    return d.dollars;
  });
};
