(function(exports) {

  var state = new Immutable.Map();
  var mutating = false;

  var root = d3.select('#revenue');
  var regionSections = root.selectAll('.regions > .region');
  var timeline = root.select('#timeline');

  var getter = eiti.data.getter;
  var formatNumber = eiti.format.dollars;
  var NULL_FILL = '#eee';

  d3.selectAll('button[aria-controls]')
    .datum(function() {
      var text = this.textContent;
      return {
        'true': this.getAttribute('data-expanded-text') || text,
        'false': this.getAttribute('data-collapsed-text') || text
      };
    })
    .on('click.aria', function(text) {
      var id = this.getAttribute('aria-controls');
      var attr = 'aria-expanded';
      var controls = d3.select('#' + id);
      var expanded = controls.attr(attr) !== 'true';
      controls.attr(attr, expanded);
      this.textContent = text[expanded];
    });

  // get the filters and add change event handlers
  var filters = root.selectAll('.filters [name]')
    // intialize the state props
    .each(function() {
      state = state.set(this.name, this.value);
    })
    .on('change', function() {
      if (mutating) return;
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
      if (mutating) return;
      var props = parseHash();
      mutateState(function() {
        return new Immutable.Map(props);
      });
    });

  function initialize() {
    var props = parseHash();
    return mutateState(function(state) {
      return state.merge(props);
    }) || render(state);
  }

  function parseHash() {
    if (!location.hash) return {};
    var hash = location.hash.substr(1);
    return eiti.url.qs.parse(hash);
  }

  function mutateState(fn) {
    mutating = true;
    var old = state;
    state = fn(state);
    if (!Immutable.is(old, state)) {
      if (!state.get('group') || state.get('group') !== old.get('group')) {
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
    console.time('render');

    // update the filters
    filters.each(function() {
      this.value = state.get(this.name) || '';
    });

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

        select.property('value', state.get('commodity') || '');
      } else {
        commodityFilter.style('display', 'none');
      }
    }

    updateFilterDescription(state);

    model.on('yearly', function(data) {
      timeline.call(updateTimeline, data, state);
    });

    selected.call(renderRegion, state);
    console.timeEnd('render');
    return true;
  }

  function renderRegion(selection, state) {
    var regionId = state.get('region') || 'US';
    var fields = getFields(regionId);

    console.log('loading', regionId);
    console.time('load');
    model.load(state, function(error, data) {
      console.timeEnd('load');

      if (error) {
        console.warn('error:', error.status, error.statusText);
        data = [];
      }

      console.time('render regions');

      var total = d3.sum(data, getter(fields.value));
      total = Math.floor(total);
      selection.select('.total')
        .text(formatNumber(total));

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
            ? NULL_FILL
            : scale(v);
        });

        selection.select('.map-legend')
          .call(updateLegend, scale);

        selection
          .call(updateSubregions, features, scale);

        console.timeEnd('render regions');
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
    var list = selection.select('.subregions');
    if (list.empty()) {
      // console.warn('no subregions list:', selection.node());
      return;
    }

    var items = list.selectAll('li')
      .data(features.filter(function(d) {
        return !!d.value;
      }), function(d) { return d.id; });

    items.exit().remove();
    var enter = items.enter()
      .append('li')
        .attr('class', 'subregion');
    var title = enter.append('h4')
      .attr('class', 'subregion-name');
    title.append('span')
      .attr('class', 'color-swatch');
    title.append('span')
      .attr('class', 'text')
      .text(function(f) {
        // XXX all features need a name!
        return f.properties.name || f.id;
      });
    enter.append('div')
      .attr('class', 'subregion-chart')
      .call(createBarChart);

    items.sort(function(a, b) {
      return d3.descending(a.value, b.value);
    });

    items.select('.color-swatch')
      .style('background-color', function(d) {
        return scale(d.value);
      });
    items.select('.subregion-chart')
      .call(updateBarChart, scale);
  }

  function createBarChart(selection) {
    var negative = selection.append('span')
      .attr('class', 'bar negative');
    negative.append('span')
      .attr('class', 'label');
    negative.append('span')
      .attr('class', 'value')
      .style('width', '0%');
    var positive = selection.append('span')
      .attr('class', 'bar positive');
    positive.append('span')
      .attr('class', 'value')
      .style('width', '0%');
    positive.append('span')
      .attr('class', 'label');
  }

  function updateBarChart(selection, colorScale) {
    var values = selection.data().map(function(d) {
      return d.value;
    });

    var max = d3.max(values);
    var scale = d3.scale.linear()
      .domain([0, max])
      .range(['0%', '50%']);

    selection.each(function(d) {
      var value = d.value;
      var positive = value >= 0 ? value : 0;
      var negative = value < 0 ? value : 0;
      var row = d3.select(this);
      row.select('.bar.positive')
        .call(updateBar, positive);
      row.select('.bar.negative')
        .call(updateBar, negative);
    });

    function updateBar(selection, value) {
      selection.select('.label')
        .text(value ? formatNumber(value) : '');
      selection.select('.value')
        .style('width', scale(Math.abs(value)));
      /*
        .style('background-color',
               value ? colorScale(value) : null);
      */
    }
  }

  function createScale(values) {
    var extent = d3.extent(values);
    var min = extent[0];
    var max = extent[1];

    var colors = (min < 0)
      ? colorbrewer.Blues
      : colorbrewer.Blues;
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
              ? formatNumber(d.range[0]) + '+'
              : formatNumber(d.range[0]);
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

  function updateTimeline(selection, data, state) {
    var fields = getFields(state.get('region'));

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
      negativeExtent[0] || -100,
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
        .attr('dy', .5);
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
    }

    var updated = selection.property('updated');
    var t = function(d) { return d; };
    if (updated) {
      t = function(d) {
        return d.transition()
          .duration(500);
      };
    }

    mask.select('.before')
      .attr('width', x(slider.value));
    mask.select('.after')
      .attr('x', x(slider.value + 1));

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
    var previous;

    model.load = function(state, done) {
      if (req) req.abort();
      var url = getDataURL(state);
      // console.log('model.load():', url);
      return req = eiti.load(url, function(error, data) {
        if (error) data = [];
        applyFilters(data, state, done);
      });
    };

    function getDataURL(state) {
      var region = state.get('region');
      var path = eiti.data.path;
      path += (!region || region === 'US')
        ? 'regional/'
        : region.length === 2
          ? 'county/by-state/' + region + '/'
          : 'offshore/'
      return path + 'revenues.tsv';
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

  function onlyYearDiffers(a, b) {
    var c = b.set('year', a.get('year'));
    return Immutable.is(a, c);
  }

  function updateFilterDescription(state) {
    var desc = root.select('#filter-description');
    var commodity = state.get('commodity') ||
      (state.get('group')
       ? eiti.commodities.groups[state.get('group')].name
       : 'all commodities')
    var data = {
      commodity: commodity.toLowerCase(),
      region: state.get('region') || 'the entire U.S.',
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

  function identity(d) {
    return d;
  }

})(this);
