(function(exports) {

  var state = new Immutable.Map();
  var getter = eiti.data.getter;
  var NONE_COLOR = '#f7f7f7';

  var regionSections = d3.selectAll('.regions > .region');
  
  var filters = d3.selectAll('.filters [name]')
    .on('change', function() {
      var prop = this.name;
      var value = this.value;
      mutateState(function(state) {
        return state.set(prop, value);
      });
    });

  var model = (function() {
    var model = {};
    var req;

    model.load = function(state, done) {
      if (req) req.abort();
      var url = getDataURL(state);
      return req = eiti.load(url, function(error, data) {
        if (error) return done(error);
        applyFilters(data, state, done);
      });
    };

    function getDataURL(state) {
      var region = state.get('region');
      var path = '../../data/';
      path += (!region || region === 'US')
        ? path + 'regional/'
        : region.length === 2
          ? (path + 'county/by-state/' + region + '/')
          : (path + 'offshore/')
      return path + 'revenues.tsv';
    }

    function applyFilters(data, state, done) {
      console.log('applying filters:', state.toJS());

      var commodity = state.get('commodity');
      var group = state.get('group');
      if (commodity) {
        data = data.filter(function(d) {
          return d.Commodity === commodity;
        });
      } else if (group) {
        var commodities = getGroupCommodities(group);
        data = data.filter(function(d) {
          return commodities.has(d.Commodity);
        });
      }

      var year = state.get('year');
      if (year) {
        data = data.filter(function(d) {
          // XXX jshint ignore
          return d.Year == year;
        });
      }

      console.log('filtered to %d rows', data.length);

      return done(null, data);
    }

    return model;
  })();

  initialize();

  function initialize() {
    var props = {};
    filters.each(function() {
      if (this.value) {
        props[this.name] = this.value;
      }
    });
    return mutateState(function(state) {
      return state.merge(props);
    });
  }

  function mutateState(fn) {
    var old = state;
    state = fn(state);
    if (old !== state) {
      render(state);
      return true;
    }
    return false;
  }

  function render(state) {
    var region = state.get('region') || 'US';
    var selected = regionSections
      .classed('active', function() {
        return this.id === region;
      })
      .filter('.active');

    var group = state.get('group');
    var commodityFilter = d3.select('#commodity-filter')
      .style('display', group ? null : 'none');
    if (group) {
      var commodities = getGroupCommodities(group).toJS();
      var select = commodityFilter
        .select('select');
      var value = select.property('value');
      var options = select
        .selectAll('option.commodity')
        .data(commodities);
      options.exit()
        .remove();
      options.enter()
        .append('option')
          .attr('class', 'commodity');
      options
        .attr('value', identity)
        .text(identity);
      if (select.property('value') !== value) {
        select.property('selectedIndex', 0);
      }
    } else {
      state = state.set('commodity', null);
    }

    selected.call(renderRegion, state);
    return true;
  }

  function renderRegion(selection, state) {
    var fields = getFields(state.get('region'));

    model.load(state, function(error, data) {
      if (error) return console.error('error:', error);

      var map = selection.select('[is="eiti-map"]');
      onMapLoaded(map, function() {
        var subregions = map.selectAll('path.feature');

        var features = subregions.data();
        var dataByFeatureId = d3.nest()
          .key(getter(fields.region))
          .rollup(function(d) {
            return d3.sum(d, getter(fields.value));
          })
          .map(data);

        // console.log('data by feature id:', dataByFeatureId);

        var featureId = getter(fields.featureId);
        features.forEach(function(f) {
          var id = featureId(f);
          f.value = dataByFeatureId[id];
        });

        var value = getter('value');
        var values = features.map(value);

        var scale = createScale(values);

        subregions.style('fill', function(d) {
          var v = value(d);
          return v === undefined
            ? NONE_COLOR
            : scale(v);
        });

        selection.select('.map-legend')
          .call(updateLegend, scale);
      });
    });
  }

  function onMapLoaded(map, fn) {
    if (map.property('loaded')) {
      return fn.apply(map.node(), map.datum());
    }
    return map.on('load', function() {
      fn.apply(this, arguments);
    });
  }

  function createScale(values) {
    var extent = d3.extent(values);
    var min = extent[0];
    var max = extent[1];

    var domain = (min < 0)
      ? [Math.min(min, 0), max]
      : [0, max];

    var colors = (min < 0)
      ? colorbrewer.PuBuGn
      : colorbrewer.Blues;
    if (max >= 1e9) {
      colors = colors[9];
      max = 1e9;
    } else if (max >= 1e6) {
      colors = colors[7];
    } else {
      colors = colors[5];
    }

    return d3.scale.quantize()
      .domain(domain)
      .range(colors);
  }

  function updateLegend(legend, scale) {
    var data = scale.range().map(function(y) {
        return {
          color: y,
          range: scale.invertExtent(y)
        };
      });
    data.push({
      color: NONE_COLOR,
      range: ['no value']
    });
    var steps = legend.selectAll('.step')
      .data(data);

    steps.exit().remove();
    steps.enter().append('div')
      .attr('class', 'step');

    steps
      .style('background-color', getter('color'))
      .attr('title', function(d) {
        return d.range.join(' to ');
      });
  }

  function getGroupCommodities(group) {
    var commodities = eiti.commodities.groups[group].commodities;
    return new Immutable.Set(commodities);
  }

  function getFields(regionId) {
    var fields = {
      region: 'Region',
      value: 'Revenue',
      featureId: 'id'
    };
    var field = 'Region';
    if (!regionId) return fields;
    switch (regionId.length) {
      case 2:
        if (regionId !== 'US') {
          fields.region = 'FIPS';
          fields.featureId = function(f) {
            return f.properties.FIPS;
          };
        }
        break;
      case 3:
        fields.region = 'Area';
        fields.featureId = function(f) {
          return f.properties.name;
        };
        break;
    }
    return fields;
  }

  function identity(d) {
    return d;
  }

})(this);
