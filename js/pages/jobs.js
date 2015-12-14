(function() {
  'use strict';

  // local alias for region id => name lookups
  var REGION_ID_NAME = eiti.data.REGION_ID_NAME;
  var colorscheme = colorbrewer.GnBu;

  // our state is immutable!
  var state = new Immutable.Map();
  var rendered = false;
  // this flag indicates whether we're in the middle of a state mutation
  var mutating = false;

  // create references for often-used elements
  var root = d3.select('#jobs');
  var regionSections = root.selectAll('.regions > .region');
  var timeline = root.select('#timeline');

  var getter = eiti.data.getter;
  var formatNumber = eiti.format.si;
  var NULL_FILL = '#f7f7f7';

  // buttons that expand and collapse other elements
  var filterToggle = root.select('button.toggle-filters');

  // get the slider to determine the year range
  var slider = root.select('#year-selector').node();

  // XXX: d3.range() is exclusive, so we need to add two
  // in order to include the last year *and* make the area render the right
  // edge of the last year.
  var years = d3.range(slider.min, slider.max + 2, 1);

  // timeline renderer
  var updateTimeline = eiti.explore.timeline()
    .years(years);

  // value accessor
  var value;
  // aggregation function
  var aggregate;

  // FIXME: componentize these too
  root.selectAll('a[data-key]')
    .on('click', function() {
      d3.event.preventDefault();
    });

  // get the filters and add change event handlers
  var filters = root.selectAll('.filters [name]')
    // intialize the state props
    .each(function() {
      state = state.set(this.name, this.value);
    })
    .on('change', function() {
      if (mutating) {
        return;
      }
      var prop = this.name;
      var value = this.value;
      mutateState(function(state) {
        return state.set(prop, value);
      });
    });

  // create our data "model"
  var model = createModel();

  // kick off the "app"
  initialize();

  // when the hash changes, update the state
  d3.select(window)
    .on('hashchange', function() {
      if (mutating) {
        return;
      }
      var props = parseHash();
      mutateState(function() {
        return new Immutable.Map(props);
      });
    });

  function initialize() {
    var props = parseHash();
    if (Object.keys(props).length) {
      filterToggle.attr('aria-expanded', true);
    }
    return mutateState(function(state) {
      return state.merge(props);
    }) || render(state);
  }

  function parseHash() {
    if (!location.hash) {
      return {};
    }
    var hash = location.hash.substr(1);
    return eiti.url.qs.parse(hash);
  }

  function mutateState(fn) {
    mutating = true;
    var old = state;
    state = fn(state);
    if (!Immutable.is(old, state)) {
      if (rendered && stateChanged(old, state, 'group')) {
        state = state.delete('commodity');
      }
      render(state, old);
      location.hash = eiti.url.qs.format(state.toJS());
      mutating = false;
      return true;
    }
    mutating = false;
    return false;
  }

  function render(state, previous) {
    // console.time('render');

    // update the filters
    filters.each(function() {
      this.value = state.get(this.name) || '';
    });

    formatNumber = state.get('units') === 'percent'
      ? eiti.format('%.2')
      : eiti.format(',');

    var region = state.get('region') || 'US';
    var selected = regionSections
      .classed('active', function() {
        return this.id === region;
      })
      .filter('.active');

    var group = state.get('group');
    var commodityFilter = root.select('#commodity-filter')
      .style('display', group ? null : 'none');

    var needsCommodityUpdate = group &&
      (!previous || group !== previous.get('group'));

    if (needsCommodityUpdate) {
      var commodities = getGroupCommodities(group);

      commodities = commodities.toJS();
      if (commodities.length > 1) {
        var select = commodityFilter
          .select('select');
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

        select.property('value', state.get('commodity') || '');
      } else {
        commodityFilter.style('display', 'none');
      }
    }

    updateFilterDescription(state);

    var fields = getFields(state);
    value = getter(fields.value);
    var first = function(d) {
      return value(d[0]);
    };
    var sum = function(data) {
      return d3.sum(data, value);
    };

    /*
     * cases in which we aggregate by the value of the first row:
     * 1. if we're looking at % units
     * 2. if we're looking at self-employment figures
     * 3. if we're looking at wage & salary figures by state
     */
    if (state.get('units') === 'percent' ||
        state.get('figure') === 'self' ||
        (state.get('figure') === 'wage' && state.get('region'))) {
      aggregate = first;
    } else {
      console.info('aggregating by sum');
      aggregate = sum;
    }

    updateTimeline
      .value(value)
      .aggregate(aggregate);

    if (state.has('year')) {
      updateTimeline.selected(state.get('year'));
    }

    model.on('yearly', function(data) {
      timeline.call(updateTimeline, data, state);
    });

    selected.call(renderRegion, state);
    // console.timeEnd('render');
    rendered = true;
  }

  function renderRegion(selection, state) {
    var regionId = state.get('region') || 'US';
    var fields = getFields(state);

    // console.log('loading', regionId);
    // console.time('load');
    model.load(state, function(error, data) {
      // console.timeEnd('load');

      if (error) {
        console.warn('error:', error.status, error.statusText);
        data = [];
      }

      // console.time('render regions');

      var header = selection.select('.region-header');
      if (header.select('*').empty()) {
        header.append('tr')
          .call(createRegionRow);
      }

      updateTimeline
        .value(fields.value)
        .aggregate(aggregate);

      var total = aggregate(data);
      header
        .datum({
          value: total,
          properties: {
            name: 'Total'
          }
        })
        .call(updateRegionRow);

      var map = selection.select('eiti-map');
      onMapLoaded(map, function() {
        var subregions = map.selectAll('path.feature');

        switch (regionId) {
          case 'US':
            subregions.on('click.mutate', eventMutator('region', 'id'));
            break;
        }

        var features = subregions.data();
        var dataByFeatureId = d3.nest()
          .key(getter(fields.subregion || fields.region))
          .rollup(aggregate)
          .map(data);

        // console.log('data by feature id:', dataByFeatureId);
        // console.log('features:', features);

        var featureId = getter(fields.featureId);
        features.forEach(function(f) {
          var id = featureId(f);
          f.value = +dataByFeatureId[id];
        });

        var value = getter('value');
        var values = features.map(value);

        var scale = createScale(values);

        subregions.style('fill', function(d) {
          var v = value(d);
          return v === undefined
            ? NULL_FILL
            : scale(v);
        });

        selection.select('.map-legend')
          .call(updateLegend, scale);

        selection
          .call(updateSubregions, features, scale);

        // console.timeEnd('render regions');
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

  function updateSubregions(selection, features, scale) {

    var list = selection.select('.subregions tbody');
    if (list.empty()) {
      // console.warn('no subregions list:', selection.node());
      return;
    }

    features = features.filter(function(d) {
      return !!d.value;
    });

    var items = list.selectAll('tr.subregion')
      .data(features, getter('id'));

    items.exit().remove();
    var enter = items.enter()
      .append('tr')
        .call(createRegionRow);

    items.sort(function(a, b) {
      return d3.descending(a.value, b.value);
    });

    items.select('.color-swatch')
      .style('background-color', function(d) {
        return scale(d.value);
      });

    items.call(updateRegionRow);
  }

  function createRegionRow(selection) {
    selection
      .attr('class', 'subregion');
    var title = selection.append('td')
      .attr('class', 'subregion-name');
    title.append('span')
      .attr('class', 'color-swatch');
    title.append('span')
      .attr('class', 'text');

    selection.append('td')
      .attr('class', 'value');

    selection.append('td')
      .attr('class', 'bar')
      .append('eiti-bar');
  }

  function updateRegionRow(selection) {
    selection.select('.subregion-name .text')
      .text(function(f) {
        // XXX all features need a name!
        return f.properties.name || '(' + f.id + ')';
      });

    var value = getter('value');
    var values = selection.data()
      .map(value)
      .sort(d3.ascending);

    selection.select('.value')
      .text(function(d) {
        return formatNumber(d.value);
      });

    var max = d3.max(values.map(Math.abs));

    selection.select('eiti-bar')
      .attr('max', max)
      .attr('value', value);
  }

  function createScale(values) {
    var extent = d3.extent(values);
    var min = extent[0];
    var max = Math.max(extent[1], 0);

    var colors = colorscheme;
    if (max >= 2e9) {
      colors = colors[7];
    } else if (max >= 1e6) {
      colors = colors[5];
    } else {
      colors = colors[3];
    }

    var domain = (min < 0)
      ? [Math.min(min, 0), max]
      : [0, max];

    domain = d3.scale.linear()
      .domain(domain)
      .nice()
      .domain();

    return d3.scale.quantize()
      .domain(domain)
      .range(colors);
  }

  function updateLegend(legend, scale) {
    var domain = scale.domain();
    if (domain.some(isNaN)) {
      legend.classed('legend-invalid', true);
      return;
    }

    legend.classed('legend-invalid', false);

    var data = scale.range().map(function(y) {
        return {
          color: y,
          range: scale.invertExtent(y)
        };
      });

    data.unshift({
      color: NULL_FILL,
      range: ['no data'],
      none: true
    });

    var last = data.length - 1;

    var steps = legend.selectAll('.step')
      .data(data);

    steps.exit().remove();
    steps.enter().append('div')
      .attr('class', 'step')
      .append('span')
        .attr('class', 'label');

    var format = state.get('units') === 'percent'
      ? formatNumber
      : eiti.format.si;
    steps
      .style('border-color', getter('color'))
      .attr('title', function(d) {
        return d.range
          .map(Math.round)
          .join(' to ');
      })
      .select('.label')
        .text(function(d, i) {
          return d.none
            ? d.range[0]
            : i === last
              ? format(d.range[0]) + '+'
              : format(d.range[0]);
        });
  }

  function getGroupCommodities(group) {
    var commodities = eiti.commodities.groups[group].commodities;
    return new Immutable.Set(commodities);
  }

  function getFields(state) {
    var fields = {
      region: 'Region',
      value: 'Value',
      featureId: function(d) {
        var id = d.id;
        return String(id).length === 4 ? '0' + id : id;
      }
    };
    switch (state.get('figure')) {
      case 'wage':
        fields.region = 'State';
        fields.subregion = state.get('region')
          ? 'FIPS'
          : 'State';
        fields.value = state.get('units') === 'percent'
         ? 'Share'
         : 'Jobs';
        break;
    }
    return fields;
  }

  function createModel() {
    var model = {};
    var dispatch = d3.dispatch('yearly');
    var req;
    var previous;

    model.load = function(state, done) {
      if (req) {
        req.abort();
      }
      var url = getDataURL(state);
      // console.log('model.load():', url);
      req = eiti.load(url, function(error, data) {
        if (error) {
          data = [];
        }
        applyFilters(data, state, done);
      });
      return req;
    };

    function getDataURL(state) {
      var path = eiti.data.path + 'jobs/';
      var figure = state.get('figure');
      var region = state.get('region');
      switch (figure) {
        case 'self':
          return path + 'self-employment.tsv';
        case 'wage':
          if (region) {
            return path + 'by-state/' + region + '/wage-salary.tsv';
          }
          return path + 'state-wage-salary.tsv';
      }
      throw new Error('invalid figure: "' + figure + '"');
    }

    function applyFilters(data, state, done) {
      // console.log('applying filters:', state.toJS());

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

      var region = state.get('region');
      if (region) {
        var fields = getFields(state);
        data = data.filter(function(d) {
          return d[fields.region] === region;
        });
      }

      dispatch.yearly(data);

      var year = state.get('year');
      if (year) {
        data = data.filter(function(d) {
          // XXX jshint ignore
          return d.Year == year;
        });
      }

      // console.log('filtered to %d rows', data.length);
      previous = state;

      return done(null, data);
    }

    return d3.rebind(model, dispatch, 'on');
  }

  function updateFilterDescription(state) {
    var desc = root.selectAll('[data-filter-description]');

    var commodity = state.get('commodity') ||
      (state.get('group')
       ? eiti.commodities.groups[state.get('group')].name
       : 'all commodities');

    var figureSelector = [
      '[name="figure"] ',
      '[value="', state.get('figure'), '"]'
    ].join('');

    var figure = root.select(figureSelector).text();

    var data = {
      commodity: commodity.toLowerCase(),
      figure: figure.toLowerCase(),
      region: REGION_ID_NAME[state.get('region') || 'US'],
      year: state.get('year')
    };

    desc.selectAll('[data-key]')
      .text(function() {
        return data[this.getAttribute('data-key')];
      });
  }

  function eventMutator(destProp, sourceKey) {
    sourceKey = getter(sourceKey);
    return function(d) {
      var value = sourceKey(d);
      mutateState(function(state) {
        return state.set(destProp, value);
      });
      d3.event.preventDefault();
    };
  }

  function stateChanged(old, state, key) {
    var prev = old.get(key) || '';
    var next = state.get(key) || '';
    return prev !== next;
  }

  function identity(d) {
    return d;
  }

})(this);
