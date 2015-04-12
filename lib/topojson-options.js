var extend = require('extend');

var defaults = {
  'verbose': true,
  'bbox': true,
  'coordinate-system': 'spherical',
  'stitch-poles': true,
  // quantization
  'quantization': 1e5,
  // preserve all properties
  'property-transform': function(d) {
    return d.properties;
  }
};

module.exports = function(options) {
  return extend({}, defaults, options);
};
