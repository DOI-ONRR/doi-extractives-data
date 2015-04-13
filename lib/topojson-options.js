var extend = require('extend');

var defaults = {
  'verbose': true,
  'bbox': true,
  'coordinate-system': 'spherical',
  'stitch-poles': true,
  // preserve all properties
  'property-transform': function(d) {
    return d.properties;
  }
};

module.exports = function(options) {
  return extend({}, defaults, options);
};
