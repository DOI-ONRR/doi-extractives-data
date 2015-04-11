var extend = require('extend');

var defaults = {
  'verbose': true,
  'coordinate-system': 'spherical',
  'stitch-poles': true,
  // no quantization
  'quantization': 0,
  // preserve all properties
  'property-transform': function(d) {
    return d.properties;
  }
};

module.exports = function(options) {
  return extend({}, defaults, options);
};
