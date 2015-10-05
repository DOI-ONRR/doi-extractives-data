
var ResourceRouter = Backbone.Router.extend({
  routes: {
    ':resource(/)':                                           'resource',
    ':resource/:datatype(/)':                                 'resource',
    ':resource/:datatype/:regiontype(/)':                     'resource',
    ':resource/:datatype/:regiontype/:region(/)':             'resource',
    ':resource/:datatype/:regiontype/:region/:subregion(/)':  'resource',
    ':resource/:datatype/:regiontype/:region(/)':             'resource',
    ':resource/:datatype/:regiontype/:region/:subregion(/)':  'resource',
  },

  initialize: function(options) {
    this.regionSelector = document.querySelector('#region-selector');
    this.regionSelector.addEventListener('change', this.onRegionChange.bind(this));
    this.dataTypeSelector = document.querySelector('#datatype-selector');
    this.dataTypeSelector.addEventListener('change', this.onDataTypeChange.bind(this));
    this.subregionSelector = document.querySelector('#subregion-selector');
  },

  navigateToParameters: function(params) {
    params = _.extend(this.params, params);
    var path = [
      params.resource || 'all',
      params.datatype || 'revenue',
      params.regiontype || 'US'
    ];
    if (params.region) {
      path.push(params.region);
      if (params.subregion) {
        path.push(params.subregion);
      }
    }
    var url = path.join('/');
    this.navigate(url);
  },

  resource: function(resource, datatype, regiontype, region, subregion) {
    var params = {
      resource: resource || 'all',
      datatype: datatype || 'revenue',
      regiontype: regiontype || 'US',
      region: region,
      subregion: subregion
    };
    this.params = params;
    console.log('resource():', params);
    this.updateSelectors(params);
  },

  updateSelectors: function(params) {
    this.updateRegionSelector(params);
    this.updateDataTypeSelector(params);
  },

  updateRegionSelector: function(params) {
    var region = params.region
      ? [params.regiontype, params.region].join('/')
      : params.regiontype;
    console.log('selected region:', region);
    this.regionSelector.value = region;
  },

  onRegionChange: function(e) {
    var value = this.regionSelector.value;
    var parts = value.split('/');
    var params = {
      regiontype: parts[0],
      region: parts[1]
    };
    this.navigateToParameters(params);
  },

  updateDataTypeSelector: function(params) {
    this.dataTypeSelector.value = params.datatype;
  },

  onDataTypeChange: function(e) {
    this.navigateToParameters({
      datatype: this.dataTypeSelector.value
    });
  }
});

var router = new ResourceRouter();
Backbone.history.start();
