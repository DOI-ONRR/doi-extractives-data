/* jshint node: true */
/* jshint -W106 */
var getModel = function(name) {
  return require('./models/' + name).models[name];
};

var models = {
  county_revenue:               getModel('county_revenue'),
  offshore_revenue:             getModel('offshore_revenue'),
  federal_county_production:    getModel('federal_county_production'),
  federal_offshore_production:  getModel('federal_offshore_production'),
  bls_employment:               getModel('bls_employment'),
};

module.exports = {
  models: models
};
