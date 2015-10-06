---

---

(function(exports) {

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
        dataPath: '/data',
        root: '#resources',
        map: '#region-map',
        inputs: {
          resource:       '#resource-selector',
          datatype:       '#datatype-selector',
          region:         '#region-selector',
          subregion:      '#subregion-selector',
          year:           '#year-slider',
        },
        outputs: {
          year:           '#output-year',
          text:           '#output-text',
          numericalTotal: '#output-numerical-total'
        }
      });

      var root = this.root = document.querySelector(options.root);
      if (!this.root) throw new Error('no such root element: "' + this.options.root + '"');

      this.resourceSelector = root.querySelector(options.inputs.resource);
      this.resourceSelector.addEventListener('change', this.onResourceChange.bind(this));

      this.regionSelector = root.querySelector(options.inputs.region);
      this.regionSelector.addEventListener('change', this.onRegionChange.bind(this));

      this.dataTypeSelector = root.querySelector(options.inputs.datatype);
      this.dataTypeSelector.addEventListener('change', this.onDataTypeChange.bind(this));

      this.subregionSelector = root.querySelector(options.inputs.subregion);
      this.subregionSelector.addEventListener('change', this.onSubregionChange.bind(this));

      this.yearSlider = root.querySelector(options.inputs.year);
      this.yearSlider.addEventListener('change', this.onYearChange.bind(this));

      this.map = root.querySelector(options.map);

      this.displayYear = this.root.querySelector(options.outputs.year);

      this.displayText = this.root.querySelector(options.outputs.text);

      this.displayNumericalTotalEl = this.root.querySelector(options.outputs.numericalTotal);

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
        params.resource,
        params.datatype,
        params.regiontype,
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

    /**
     * This is the main state update function. It sets the _updating flag to
     * `true` so that we don't end up in an infinite loop of elements changing
     * and triggering their own change handlers.
     *
     * @param Object params
     * @return void
     */
    update: function(params) {
      this._updating = true;

      this.updateSelectors(params);
      this.loadData(params);
      this.updateMap(params);

      if (params.year) {
        this.yearSlider.value = params.year;
      }
      

      this._updating = false;
    },

    /**
     * Update the map.
     * @param Object params
     */
    updateMap: function(params) {
      var map = this.map;

      var featureId = null;
      switch (params.regiontype) {
        case 'onshore':
        case 'offshore':
          featureId = params.region;
          break;
      }

      onMapLoaded(map, function() {
        map.zoomTo(featureId);
      });

      var url = this.getDataURL(params);
      console.log('loading data from:', url);

      if (this.dataRequest) {
        this.dataRequest.abort();
      }

      var that = this;
      this.dataRequest = d3.tsv(url, function(error, data) {
        that.dataRequest = null;

        if (error) {
          return console.error('unable to load data from %s:', url, error.responseText);
        }

        that.findDataMatch(data, params);

        console.warn('loaded data:', data);
        onMapLoaded(map, function() {
          // TODO: display some data!
        });
      });
    },

    /**
    * Get the URL of the relevant data file for a given set of parameters.
    * @param Object params
    * @return String the data URL
    */
    loadData: function(params){
      var url = this.getDataURL(params);
// 
      var that = this;
      this.loadDataRequest = d3.tsv(url, function(error, data) {
        that.loadDataRequest = null;

        if (error) {
          return console.error('unable to load data from %s:', url, error.responseText);
        }

        that.findDataMatch(data, params);

        console.warn('loadData() loaded data:', data);
 
      });
     },

    /**
     * Get the URL of the relevant data file for a given set of parameters.
     * @param Object params
     * @return String the data URL
     */
    getDataURL: function(params) {
      var path = [
        this.options.dataPath
      ];

      if (params.subregion){
        switch (params.datatype) {
          case 'revenue':
            switch (params.regiontype) {
              case 'onshore':
                // onshore county-level revenue
                path.push('county', 'by-state', params.region, 'resource-revenues.tsv');
                break;

              case 'offshore':
                // FIXME: make sure these data files exist
                // offshore county-level revenue
                path.push('offshore');
                break;

              default:
                break;
            }
            break;
          // FIXME: add 'exports case'
          default:
            // FIXME: vary by datatype
            break;
        }
      } else {
        switch (params.datatype) {
          case 'revenue':
            // state level revenue
            path.push('regional','resource-revenues.tsv');
            break;
          case 'exports':
            // state level exports
            path.push('state','exports-by-industry.tsv');
            break;

          default:
            // FIXME: vary by datatype
            break;
        }
      }
      

      return path.join('/');
    },

    /**
    * This filters data (onshore and offshore)
    * when parameters change
    *
    * @param Object params
    * @return 
    */
    findDataMatch: function(data, params) {
      params = params || this.params;
      console.warn('behold, your data: ', data);
      params.year = (params.year).toString();
      if (params.region && params.resource && params.year && params.datatype == 'revenue'){
        console.log('params',params)
        if (!params.subregion){
          this.currentDataMatch = _.findWhere(data, {
            "Region": params.region,
            "Resource": params.resource,
            "Year": params.year
          });
          
        } else if (params.subregion){
          this.currentDataMatch = _.findWhere(data, {
            "State": params.region,
            "County": params.subregion,
            "Resource": params.resource,
            "Year": params.year
          });
        }
        if (this.currentDataMatch){
          console.warn('matching regional revenues data', this.currentDataMatch)
          this.updateOutputs(params);

        } else {
          console.warn('no available revenues data')
          this.updateOutputs(params);
        }
      } else {
        // TODO filter for exports
        console.warn('no filter in place for exports data.')
        this.currentDataMatch = null;
        this.updateOutputs(params);
      }
      
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

        var that = this;
        this.subregionRequest = eiti.load(subregionURL, function(error, subregions) {
          that.subregionRequest = null;

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
    },

    /**
     * This updates the total (in dollars) associated with data filters
     * change.
     *
     * @param Object params
     * @return void
     */
    displayNumericalTotal: function() {
      this.displayNumericalTotalEl.innerHTML = this.currentDataMatch 
        ? '$' + this.currentDataMatch.Revenue
        : 'N/A';
    },

    /**
     * This displays the data filter parameters
     * change.
     *
     * @param Object params
     * @return void
     */
    displayFilterParameters: function(params) {
      params = params || this.params;
      this.resourceSelector.selectedIndex != -1 
        ? this.resourceSelector.selectedIndex
        : 0;
      var selectedResourceIndex = this.resourceSelector.selectedIndex;
      var resource = this.resourceSelector[selectedResourceIndex].innerHTML;
      // placeholder logic while there are only two options
      var dataType = params.datatype === 'revenue'
        ? 'Revenues'
        : 'Exports';
      var selectedRegionIndex = this.regionSelector.selectedIndex;
      var regionName = this.regionSelector[selectedRegionIndex].innerHTML || 'All US';
      var region = params.subregion 
        ? params.subregion + ', ' + regionName
        : regionName;
      var year = this.displayYear.innerHTML = params.year || '2013';

      // format the text to be displayed
      var displayText = resource + ' ' + dataType + ' in ' + region + ' in ' + year;
      this.displayText.innerHTML = displayText;
    },

    /**
     * This triggers functions that display the data filter parameters
     * and display the total $$ associated with those filters
     *
     * @param Object params
     * @return void
     */
    updateOutputs: function(params) {
      this.displayFilterParameters(params);
      this.displayNumericalTotal();
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
  router.updateOutputs();
  router.loadData(router.params);

  // exports.router = router;

  function onMapLoaded(map, callback) {
    if (map.loaded) {
      return callback(map);
    } else {
      var onload;
      map.addEventListener('load', onload = function(e) {
        map.removeEventListener('load', onload);
        map.loaded = true;
        callback(map);
      });
    }
  }

})(this);
