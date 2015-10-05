var ResourceRouter = Backbone.Router.extend({
  routes: {
    ':resource':                                        'resource',
    ':resource/:datatype':                              'resource',
    ':resource/:datatype/:region':                      'resource',
    ':resource/:datatype/onshore/:region':              'resource',
    ':resource/:datatype/onshore/:region/:subregion':   'resource',
    ':resource/:datatype/offshore/:region':             'resource',
    ':resource/:datatype/offshore/:region/:subregion':  'resource',
  },

  resource: function(resource, datatype, region, subregion) {
    if (!resource) resource = 'all';
    if (!datatype) datatype = 'revenue';
    if (!region) region = 'US';
    console.log('resource(', arguments, '):', {
      resource: resource,
      datatype: datatype,
      region: region,
      subregion: subregion
    });
  }
});

var router = new ResourceRouter();
Backbone.history.start();
