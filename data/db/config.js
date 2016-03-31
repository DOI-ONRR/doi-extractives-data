/* jshint node */
var getModel = function(name) {
  return require('./models/' + name).models[name];
};

var models = {
  county_revenue:      getModel('county_revenue'),
  county_production:   getModel('county_production'),
  // offshore_revenue:    getModel('offshore_revenue'),
  // offshore_production: getModel('offshore_production'),
};

module.exports = {
  models: models
};
