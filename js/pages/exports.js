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
  var root = d3.select('#gdp');
  var regionSections = root.selectAll('.regions > .region');
  var timeline = root.select('#timeline');

  var getter = eiti.data.getter; // getter("foo")({foo: 1}) === 1
  var formatDollars = eiti.format.dollars;
  var formatPercent = d3.format('%.2');
  var formatNumber = formatDollars;
  var NULL_FILL = '#eee';

  // buttons that expand and collapse other elements
  var filterToggle = root.select('button.toggle-filters');

  // FIXME: componentize these too
  root.selectAll('a[data-key]')
    .on('click', function() {
      d3.event.preventDefault();
    });

  // get the filters and add change event handlers
  var filters = root.selectAll('.filters [name]');

  var initFilters = function(filters, units) {

    filters.each(function() {

      if (this.type == 'radio'){

        if (units == this.value) {
          this.checked = false;
          this.setAttribute('checked', false);
          state = state.set(this.name, this.value);
        } else {
          this.checked = true;
          this.setAttribute('checked', true);
        }
      } else {
        state = state.set(this.name, this.value);
      }
    });
  };

  var parsedHash = parseHash();
  if (parsedHash.units) {
    initFilters(filters, parsedHash.units);
  } else {
    initFilters(filters, 'dollars');
  }

  filters.on('change', function() {

    if (mutating) {
      return;
    }

    var prop = this.name;
    var value = this.value;

    if (this.type == 'radio') {

      var self = this;
      filters.each(function() {
        if (this.type === 'radio'){
          if (this.value == self.value) {
            this.checked = true;
            this.setAttribute('checked', true);
          } else {
            this.checked = false;
            this.setAttribute('checked', false);
          }
        }
      });

      var props = parseHash();

      props.units = this.value;

      mutateState(function(state) {
        return state.merge(props);
      });
    } else {
      mutateState(function(state) {
        return state.set(prop, value);
      });
    }


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
      render(state, old);
      location.hash = eiti.url.qs.format(state.toJS());
      mutating = false;
      return true;
    }
    mutating = false;
    return false;
  }

  function updateFilters(state){
    filters.each(function() {
      if (this.type == 'radio') {
        if (this.value === state.get(this.name)) {
          this.checked = true;
          this.setAttribute('checked', true);

        } else {
          this.checked = false;
          this.setAttribute('checked', false);
        }
      } else {
        this.value = state.get(this.name) || '';
      }

    });
  }

  function render(state, previous) {
    // console.time('render');

    // update the filters
    updateFilters(state);

    formatNumber = state.get('units') === 'percent'
      ? formatPercent
      : formatDollars;

    var region = state.get('region') || 'US';
    var selected = regionSections
      .classed('active', function() {
        return this.id === region;
      })
      .filter('.active');

    updateFilterDescription(state);

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
      if (header.select('tr').empty()) {
        header.append('tr')
          .call(createRegionRow);
      }

      var first = data[0];
      var value = getter(fields.value);
      header
        .datum({
          data: first,
          value: first.Value,
          share: first.Share, // XXX
          properties: {
            name: regionId === 'US' ? 'Nationwide' : 'Total'
          }
        })
        .call(updateRegionRow, true);

      var map = selection.select('[is="eiti-map"]');
      onMapLoaded(map, function() {
        var subregions = map.selectAll('path.feature');

        switch (regionId) {
          case 'US':
            subregions.on('click.mutate', eventMutator('region', 'id'));
            break;
        }

        var features = subregions.data();
        var dataByFeatureId = d3.nest()
          .key(getter(fields.region))
          .rollup(function(d) {
            return d[0];
          })
          .map(data);

        // console.log('data by feature id:', dataByFeatureId);

        var featureId = getter(fields.featureId);
        features.forEach(function(f) {
          var id = featureId(f);
          var d = dataByFeatureId[id];
          f.data = d;
          f.value = d ? d.Value : undefined;
          f.share = d ? d.Share : undefined; // XXX
        });

        var percent = state.get('units') === 'percent';
        var value = getter(percent ? 'share' : 'value');
        var values = features.map(value);

        var scale = createScale(values, state);

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

    var key = state.get('units') === 'percent'
      ? 'share'
      : 'value';
    items.sort(function(a, b) {
      return d3.descending(a[key], b[key]);
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
      .attr('class', 'value value_dollars');
    selection.append('td')
      .attr('class', 'bar bar_dollars')
      .append('eiti-bar');

    selection.append('td')
      .attr('class', 'value value_share');
    selection.append('td')
      .attr('class', 'bar bar_share')
      .append('eiti-bar')
        .attr('max', 1);
  }

  function updateRegionRow(selection, isHeader) {
    selection.select('.subregion-name .text')
      .text(function(f) {
        // XXX all features need a name!
        return f.properties.name || '(' + f.id + ')';
      });

    var value = getter('value');
    var values = selection.data()
      .map(value)
      .sort(d3.ascending);

    var max = d3.max(values.map(Math.abs));

    selection.select('.value_dollars')
      .text(function(d) {
        return formatDollars(d.value);
      });
    selection.select('.bar_dollars eiti-bar')
      .attr('max', max)
      .attr('value', value);

    selection.select('.value_share')
      .text(function(d) {
        return formatPercent(d.share);
      });
    selection.select('.bar_share eiti-bar')
      .attr('value', getter('share'));
  }

  function createScale(values, state) {
    if (state.get('units') === 'percent') {
      return d3.scale.quantize()
        .domain([0, 1])
        .range(colorscheme[5]);
    }

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

    steps
      .style('border-color', getter('color'))
      .select('.label')
        .text(function(d, i) {
          return d.none
            ? d.range[0]
            : i === last
              ? formatNumber(d.range[0]) + '+'
              : formatNumber(d.range[0]);
        });
  }

  function getFields(state) {
    var fields = {
      region: 'State',
      value: state.get('units') === 'percent'
        ? 'Share'
        : 'Value',
      featureId: 'id'
    };
    return fields;
  }

  function updateTimeline(selection, data, state) {
    var fields = getFields(state);

    var value = getter(fields.value);
    var dataByYearPolarity = d3.nest()
      .key(function(d) {
        return value(d) < 0 ? 'negative' : 'positive';
      })
      .key(getter('Year'))
      .rollup(function(d) {
        return d3.sum(d, value);
      })
      .map(data);

    // console.log('data by year/polarity:', dataByYearPolarity);
    var positiveYears = dataByYearPolarity.positive || {};
    var positiveExtent = d3.extent(d3.values(positiveYears));
    var negativeYears = dataByYearPolarity.negative || {};
    var negativeExtent = d3.extent(d3.values(negativeYears));

    // get the slider to determine the year range
    var slider = root.select('#year-selector').node();

    // XXX: d3.range() is exclusive, so we need to add two
    // in order to include the last year *and* make the area render the right
    // edge of the last year.
    var years = d3.range(slider.min, slider.max + 2, 1);

    var w = 500;
    var h = 40;
    var viewBox = selection.attr('viewBox');
    // if there is a viewBox already, derive the dimensions from it
    if (viewBox) {
      viewBox = viewBox.split(' ').map(Number);
      w = viewBox[2];
      h = viewBox[3];
    } else {
      // otherwise, set up the viewBox with our default dimensions
      selection.attr('viewBox', [0, 0, w, h].join(' '));
    }

    var left = 0; // XXX need to make room for axis labels
    var right = w;

    // the x-axis scale
    var x = d3.scale.linear()
      .domain(d3.extent(years))
      .range([left, right + 2]);

    // the y-axis domain sets a specific point for zero.
    // the `|| -100` and `|| 100` bits here ensure that the domain has some
    // size, even if there is no data from which to derive an extent.
    var yDomain = [
      negativeExtent[0] || 0,
      positiveExtent[1] || 100
    ];
    // the y-axis scale, with the zero point at 3/4 the height
    // XXX: note that this exaggerates the negative scale!
    var y = d3.scale.linear()
      .domain(yDomain)
      .range([h, 0]);

    var area = d3.svg.area()
      .interpolate('step-after')
      .x(function(d) { return x(d.year); })
      .y0(y(0))
      .y1(function(d) { return y(d.value); });

    var areas = selection.selectAll('path.area')
      .data([
        {
          polarity: 'positive',
          values: years.map(function(year) {
            return {
              year: year,
              value: positiveYears[year] || 0
            };
          })
        },
        {
          polarity: 'negative',
          values: years.map(function(year) {
            return {
              year: year,
              value: negativeYears[year] || 0
            };
          })
        }
      ]);

    areas.exit().remove();
    areas.enter().append('path')
      .attr('class', function(d) {
        return 'area ' + d.polarity;
      });

    var zero = selection.select('g.zero');
    if (zero.empty()) {
      zero = selection.append('g')
        .attr('class', 'zero');
      zero.append('line');
      zero.append('text')
        .attr('class', 'label')
        .attr('text-anchor', 'end')
        .attr('dy', 0.5);
        // .text(0);
    }

    var mask = selection.select('g.mask');
    if (mask.empty()) {
      mask = selection.append('g')
        .attr('class', 'mask');
      mask.append('rect')
        .attr('class', 'before')
        .attr('x', 0)
        .attr('width', 0)
        .attr('height', h);
      mask.append('rect')
        .attr('class', 'after')
        .attr('x', w)
        .attr('width', w)
        .attr('height', h);
      mask.append('line')
        .attr('class', 'before')
        .attr('y1', 0)
        .attr('y2', h);
      mask.append('line')
        .attr('class', 'after')
        .attr('y1', 0)
        .attr('y2', h);
    }

    var updated = selection.property('updated');
    var t = function(d) { return d; };
    if (updated) {
      t = function(d) {
        return d.transition()
          .duration(500);
      };
    }

    var year1 = slider.value;
    var year2 = slider.value + 1;
    var beforeX = x(year1);
    var afterX = Math.min(x(year2), w);
    // don't transition these
    mask.select('rect.before')
      .attr('width', beforeX);
    mask.select('rect.after')
      .attr('x', afterX);
    mask.select('line.before')
      .attr('transform', 'translate(' + [beforeX, 0] + ')');
    mask.select('line.after')
      .attr('transform', 'translate(' + [afterX, 0] + ')');

    // transition these
    // mask = t(mask);
    mask.selectAll('line')
      .attr('y1', y(positiveYears[year1] || 0))
      .attr('y2', y(negativeYears[year1] || 0));

    zero.select('line')
      .attr('x1', left)
      .attr('x2', right);

    zero.select('.label')
      .attr('transform', 'translate(' + [left, 0] + ')');

    t(zero).attr('transform', 'translate(' + [0, y(0)] + ')');

    t(areas).attr('d', function(d) {
      return area(d.values);
    });
    selection.property('updated', true);
  }

  function createModel() {
    var model = {};
    var dispatch = d3.dispatch('yearly');
    var req;

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
      return eiti.data.path + 'state/exports-by-industry.tsv';
    }

    function applyFilters(data, state, done) {
      // coerce strings to numbers
      data.forEach(function(d) {
        d.Value = +d.Value;
        d.Share = +d.Share;
      });

      // console.log('applying filters:', state.toJS());
      var region = state.get('region');
      if (region) {
        var fields = getFields(state);
        var getRegion = getter(fields.region);
        data = data.filter(function(d) {
          return getRegion(d) === region;
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

      return done(null, data);
    }

    return d3.rebind(model, dispatch, 'on');
  }

  function updateFilterDescription(state) {
    var desc = root.selectAll('[data-filter-description]');

    var data = {
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

})(this);
