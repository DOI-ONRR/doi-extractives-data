(function(exports) {

  var state = new Immutable.Map();
  var getter = eiti.data.getter;
  var NONE_FILL = '#f7f7f7';

  var regionSections = d3.selectAll('.regions > .region');
  var formatNumber = eiti.format.dollars;
  
  var filters = d3.selectAll('.filters [name]')
    .on('change', function() {
      var prop = this.name;
      var value = this.value;
      mutateState(function(state) {
        return state.set(prop, value);
      });
    });

  var timeline = d3.select('#timeline');

  var model = (function() {
    var model = {};
    var dispatch = d3.dispatch('yearly');
    var req;
    var previous;

    model.load = function(state, done) {
      if (req) req.abort();
      var url = getDataURL(state);
      return req = eiti.load(url, function(error, data) {
        if (error) data = [];
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

      if (!previous || !onlyYearDiffers(state, previous)) {
        if (previous) console.log('yearly change:', previous.toJS(), '->', state.toJS());
        dispatch.yearly(data);
      }

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
      render(state, old);
      return true;
    }
    return false;
  }

  function render(state, previous) {
    var region = state.get('region') || 'US';
    var selected = regionSections
      .classed('active', function() {
        return this.id === region;
      })
      .filter('.active');

    var group = state.get('group');
    var commodityFilter = d3.select('#commodity-filter')
      .style('display', group ? null : 'none');

    if (group && group !== previous.get('group')) {
      state = state.delete('commodity');

      var commodities = getGroupCommodities(group).toJS();
      var select = commodityFilter
        .select('select')
          .property('selectedIndex', 0);
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
    }

    model.on('yearly', function(data) {
      timeline.call(updateTimeline, data, state);
    });

    selected.call(renderRegion, state);
    return true;
  }

  function renderRegion(selection, state) {
    var regionId = state.get('region');
    var fields = getFields(regionId);

    model.load(state, function(error, data) {
      if (error) {
        console.warn('error:', error.status, error.statusText);
        data = [];
      }

      var total = d3.sum(data, getter(fields.value));
      total = Math.floor(total);
      selection.select('.total')
        .text(formatNumber(total));

      var map = selection.select('[is="eiti-map"]');
      onMapLoaded(map, function() {
        var subregions = map.selectAll('path.feature')
          .filter(function(d) {
            return d.id !== regionId;
          });

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
            ? NONE_FILL
            : scale(v);
        });

        selection.select('.map-legend')
          .call(updateLegend, scale);

        selection
          .call(updateSubregions, features, scale);
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
      console.warn('no subregions list:', selection.node());
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
    enter.append('h2')
      .attr('class', 'subregion-name')
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

    items.select('.subregion-chart')
      .call(updateBarChart);
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

  function updateBarChart(selection) {
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
    }
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
      color: NONE_FILL,
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
    var slider = d3.select('#year-selector').node();

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

    var left = w / 10;
    var right = w;

    // the x-axis scale
    var x = d3.scale.linear()
      .domain(d3.extent(years))
      .range([left, right]);

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
        .attr('dy', .5)
        .text(0);
    }

    var updated = selection.property('updated');
    var t = function(d) { return d; };
    if (updated) {
      t = function(d) {
        return d.transition()
          .duration(500);
      };
    }

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

  function onlyYearDiffers(a, b) {
    var c = b.set('year', a.get('year'));
    return Immutable.is(a, c);
  }

  function identity(d) {
    return d;
  }

})(this);
