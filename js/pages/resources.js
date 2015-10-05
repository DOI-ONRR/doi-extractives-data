
/**
 * @class ResourceRouter
 *
 * @example
 * var router = new ResourceRouter();
 * Backbone.history.start();
 */
var ResourceRouter = Backbone.Router.extend({
  routes: {
    // #oilgas
    ':resource':                                          'resource',
    // #coal/revenue
    ':resource/:datatype':                                'resource',
    // #minerals/exports/US
    ':resource/:datatype/:regiontype':                    'resource',
    // #coal/exports/onshore/CA
    // #coal/exports/offshore/GOA
    ':resource/:datatype/:regiontype/:region':            'resource',
    // #coal/exports/onshore/CA/Inyo
    ':resource/:datatype/:regiontype/:region/:subregion': 'resource',
  },

  /**
   * The class constructor.
   *
   * @param Object options
   */
  initialize: function(options) {
    this.options = options = _.defaultsDeep(options || {}, {
      root: '#resources',
      inputs: {
        resource:   '#resource-selector',
        datatype:   '#datatype-selector',
        region:     '#region-selector',
        subregion:  '#subregion-selector',
        year:       '#year-slider',
      }
    });

    this.root = document.querySelector(options.root);
    if (!this.root) throw new Error('no such root element: "' + this.options.root + '"');

    this.resourceSelector = this.root.querySelector(options.inputs.resource);
    this.resourceSelector.addEventListener('change', this.onResourceChange.bind(this));

    this.regionSelector = this.root.querySelector(options.inputs.region);
    this.regionSelector.addEventListener('change', this.onRegionChange.bind(this));

    this.dataTypeSelector = this.root.querySelector(options.inputs.datatype);
    this.dataTypeSelector.addEventListener('change', this.onDataTypeChange.bind(this));

    this.subregionSelector = this.root.querySelector(options.inputs.subregion);
    this.subregionSelector.addEventListener('change', this.onSubregionChange.bind(this));

    this.yearSlider = this.root.querySelector(options.inputs.year);
    this.yearSlider.addEventListener('change', this.onYearChange.bind(this));

    this.params = {};
  },

  /**
   * Navigate to a new URL by setting one or more new
   * parameters. This will trigger a call to navigate() with a
   * new URL.
   *
   * @param Object params
   * @return void
   */
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
        path.push(encodeURIComponent(params.subregion));
      }
    }
    var url = path.join('/');
    if (params.year) {
      url += '?year=' + params.year;
    }
    this.navigate(url, {trigger: true});
  },

  /**
   * This is the main route handler. It does a couple of things:
   *
   * 1. If it finds an "=" in the last parameter, it treats it
   *    like a query string.
   * 1. It constructs a hash of named parameters from the
   *    positional args and saves this in `this.params` for
   *    later reference.
   * 1. It calls `this.update()` to update the state of its
   *    various selector inputs.
   *
   * @return void
   */
  resource: function(resource, datatype, regiontype, region, subregion) {
    var last = arguments[arguments.length - 1];
    var query;
    if (last && last.match(/=/)) {
      query = this.parseQueryString(last);
      arguments[arguments.length - 1] = null;
    }

    var params = _.defaults({
      resource: resource,
      datatype: datatype,
      regiontype: regiontype,
      region: region,
      subregion: subregion
    }, {
      resource: 'all',
      datatype: 'revenue',
      regiontype: 'US',
      year: this.yearSlider.value
    });

    if (query) {
      params = _.extend(params, query);
    }

    this.params = params;
    console.log('resource():', params);
    this.update(params);
  },

  update: function(params) {
    this._updating = true;

    this.updateSelectors(params);

    if (params.year) {
      this.yearSlider.value = +params.year;
    }

    this._updating = false;
  },

  /**
   * Update the various selectors based on a hash of named
   * parameters.
   *
   * @param Object params
   * @return void
   */
  updateSelectors: function(params) {
    this.updateResourceSelector(params);
    this.updateRegionSelector(params);
    this.updateDataTypeSelector(params);
  },

  /**
   * Update the resource selector.
   */
  updateResourceSelector: function(params) {
    this.resourceSelector.value = params.resource;
  },

  /**
   * Update the region selector.
   * @param Object params
   * @return void
   */
  updateRegionSelector: function(params) {
    var region = params.region
      ? [params.regiontype, params.region].join('/')
      : params.regiontype;
    console.log('selected region:', region);
    this.regionSelector.value = region;

    // cancel the outbound subregion request
    if (this.subregionRequest) {
      this.subregionRequest.abort();
    }

    // request new subregions if there's a "region" param
    if (params.region) {
      // TODO: show the selector

      var selector = d3.select(this.subregionSelector);
      var options = selector.selectAll('option.subregion');
      var subregionURL = [
        '/data/county/by-state',
        params.region,
        'counties.tsv'
      ].join('/');

      console.log('loading subregions:', subregionURL);

      this.subregionRequest = d3.tsv(subregionURL, function(error, subregions) {
        if (error) {
          return console.error('unable to load subregions:', error.responseText);
        }

        console.warn('loaded subregions:', subregions);
        subregions.sort(function(a, b) {
          return d3.ascending(a.name, b.name);
        });

        options = options.data(subregions);
        options.exit().remove();
        options.enter().append('option')
          .attr('class', 'subregion');
        options.text(function(d) {
          return d.name;
        });

        selector.property('value', params.subregion);
      });

    } else {
      // TODO: hide the selector
    }
  },

  /**
   * Update the data type selector.
   * @param Object params
   * @return void
   */
  updateDataTypeSelector: function(params) {
    this.dataTypeSelector.value = params.datatype;
  },

  /**
   * This is the "change" event handler for the resource
   * selector. It calls `this.navigateToParameters()` and sets
   * the "resource" parameter based on the value of the
   * selector.
   *
   * @param Event e
   * @return void
   */
  onResourceChange: function(e) {
    if (this._updating) return;
    this.navigateToParameters({
      resource: this.resourceSelector.value
    });
  },

  /**
   * This is the "change" event handler for the region selector.
   * It calls `this.navigateToParameters()` and sets the
   * "regiontype" and "subregion" parameters based on the value
   * of the selector.
   *
   * @param Event e
   * @return void
   */
  onRegionChange: function(e) {
    if (this._updating) return;
    var value = this.regionSelector.value;
    var parts = value.split('/');
    var params = {
      regiontype: parts[0],
      region: parts[1],
      subregion: null
    };
    this.navigateToParameters(params);
  },

  /**
   * This is the "change" event handler for the subregion
   * (county or offshore area) selector. It calls
   * `this.navigateToParameters()` and sets the "subregion"
   * parameter based on the value of the selector.
   *
   * @param Event e
   * @return void
   */
  onSubregionChange: function(e) {
    this.navigateToParameters({
      subregion: this.subregionSelector.value
    });
  },

  /**
   * This is the "change" event handler for the data type
   * selector. It calls `this.navigateToParameters()` and sets
   * the "datatype" parameter based on the input value.
   * @param Event e
   * @return void
   */
  onDataTypeChange: function(e) {
    if (this._updating) return;
    this.navigateToParameters({
      datatype: this.dataTypeSelector.value
    });
  },

  /**
   * This is the "change" event handler for the year slider.
   * @param Event e
   * @return void
   */
  onYearChange: function(e) {
    if (this._updating) return;
    this.navigateToParameters({
      year: this.yearSlider.value
    });
  },

  /**
   * This is a minimal query string parameter parser.
   *
   * @param String str
   * @return Object
   */
  parseQueryString: function(str) {
    // strip the leading "?"
    if (str.charAt(0) === '?') {
      str = str.substr(1);
    }
    return str.split('&').reduce(function(query, part) {
      var bits = part.split('=');
      var key = bits[0];
      var value = bits.length > 1
        ? decodeURIComponent(bits[1])
        : true;
      query[bits[0]] = value;
      return query;
    }, {});
  }
});

// kick off the router
var router = new ResourceRouter();
Backbone.history.start();
if (!location.hash) {
  router.navigateToParameters({
    resource: 'all',
    datatype: 'revenue',
    regiontype: 'US'
  });
}
