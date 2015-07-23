var qs = require('querystring');
var extend = require('extend');

var filters = {

  jsonify: JSON.stringify,

  slugify: function(value) {
    return String(value)
      .toLowerCase()
      .replace(/\W+/g, '_');
  },

  qs: function(value, values) {
    values = [].map.call(arguments, queryObject);
    value = extend.apply(null, values);
    return qs.stringify(value);
  }
};

function queryObject(value) {
  if (typeof value !== 'object') {
    return qs.parse(String(value).replace(/^\?/, ''));
  }
  return value;
}

module.exports = {
  filters: filters,
  register: function(env) {
    for (var key in filters) {
      env.addFilter(key, filters[key]);
    }
  }
};
