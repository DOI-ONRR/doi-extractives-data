/* jshint node: true */
/* jshint -W106 */
var getModel = function(name) {
  return require('./models/' + name).models[name];
};

var models = {
  county_revenue:   getModel('county_revenue'),
  offshore_revenue: getModel('offshore_revenue'),
  bls_employment:   getModel('bls_employment'),
};

module.exports = {
  models: models
};
