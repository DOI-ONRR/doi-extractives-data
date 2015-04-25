(function(exports) {

  var state = {
    year: 2013
  };

  var data = {};

  var prog = progressive();

  var commodities = eiti.data.Commodities();

  var groupCommodities = function(d) {
    d.ActualCommodity = d.Commodity;
    d.Commodity = commodities.getGroup(d.Commodity);
  };

  var commodityId = function(key) {
    return 'commodities/' + normalize(key);
  };

  var getter = eiti.data.getter;

  var proj = d3.geo.albersCustom();
  var path = d3.geo.path()
    .projection(proj);

  d3.select('#progress')
    .call(progressive.bar(prog));

  window.addEventListener('resize', resize);

  console.log('loading...');
  console.time('load');
  var dataPath = 'output/';
  queue()
    .defer(prog, d3.tsv, dataPath + 'national/revenues-yearly.tsv')
    .defer(prog, d3.tsv, dataPath + 'state/revenues-yearly.tsv')
    .defer(prog, d3.json, dataPath + 'geo/us-states-simple.json')
    .await(function(error, natlRevenues, stateRevenues, topology) {
      if (error) return console.error(error.responseText);
      console.timeEnd('load');

      natlRevenues = natlRevenues.filter(function(d) {
        return d.Year > 2003;
      });

      natlRevenues.forEach(groupCommodities);
      stateRevenues.forEach(groupCommodities);

      data.revenues = {
        national: natlRevenues,
        state: stateRevenues
      };

      var states = topology.objects.states;
      data.geo = {
        states: {
          topology: topology,
          features: topojson.feature(topology, states).features,
          mesh: topojson.mesh(topology, states)
        }
      };

      console.log('loaded!', data);
      console.time('render');
      renderTimeline();
      renderSymbols();
      renderCommodityMaps();
      console.timeEnd('render');

      update();
      resize();

      eiti.util.jiggleHash();
      // if (location.hash) scrollTo(location.hash);
    });

  function setYear(year) {
    state.year = year;
    update();
  }

  function update() {
    updateTimeline(state);
    updateCommodityMaps(state);
  }

  function updateTimeline(state) {
    d3.select('#national-revenues svg')
      .selectAll('.x .tick')
        .classed('hilite', function(y) {
          return y == state.year;
        });
  }

  function renderTimeline() {
    var fill = function(key) {
      return commodities.getPrimaryColor(key);
    };

    var area = eiti.charts.area()
      .stacked(false)
      .voronoi(true)
      .fill(fill);

    var svg = d3.select('#national-revenues svg')
      .call(area, data.revenues.national);

    svg.selectAll('a')
      .attr('xlink:href', function(d) {
        return '#' + commodityId(d.key);
      });

    var format = eiti.format.shortDollars;
    var tip = eiti.ui.tip()
      .attr('class', 'tooltip')
      .direction('n')
      .offset([-10, 0])
      // note: this is an eiti.tip-specific hack
      .target(function() {
        return this.querySelector('circle');
      })
      .html(function(v) {
        return [v.key, ': ', format(v.y), ' in ', v.x].join('');
      });

    svg.call(tip);

    var regions = svg.selectAll('.voronoi g.region')
      .on('mouseover', tip.show, true)
      .on('mouseout', tip.hide, true)
      .on('focus', tip.show, true)
      .on('blur', tip.hide, true);
    regions.select('a')
      .attr('tabindex', 0);
    regions.select('circle')
      .attr('r', 4)
      .attr('fill', function(d) {
        return fill(d.key);
      });

    var margin = area.margin();
    var offset = 8;
    d3.select('#slider-container')
      .style('margin-left', (margin.left - offset) + 'px')
      .style('margin-right', (margin.right - offset + 2) + 'px');

    var slider = d3.select('#year-slider')
      .on('change', function() {
        setYear(+this.value);
      })
      .property('value', state.year);
  }

  function renderSymbols() {
    var symbols = d3.select('svg#symbols');
    var defs = symbols.append('defs');
    var mesh = defs.append('path')
      .attr('id', 'states-mesh')
      .attr('class', 'mesh states')
      .attr('d', path(data.geo.states.mesh));
  }

  function renderCommodityMaps() {
    var size = proj.size ? proj.size() : [960, 500];

    // nest revenues data by commodity, state and year:
    // index[commodity][state][year] = sumOfRevenues
    var index = eiti.data.nest(data.revenues.state, [
      'Commodity',
      'State',
      'Year'
    ], function(d) {
      return d3.sum(d, getter('Revenue'));
    });

    var entries = d3.entries(index);

    // filter out commodities with only one value
    entries = entries
      .filter(function(d) {
        return Object.keys(d.value).length > 1;
      })

    var format = eiti.format.dollars;
    var steps = 9;

    entries.forEach(function(c) {
      var values = [];
      eiti.data.walk(c.value, function(d) {
        values.push(d);
      });

      c.extent = d3.extent(values);
      if (c.extent[0] === c.extent[1]) {
        c.extent[0] = 0;
      }
      // console.log(c.key, 'max:', c.max);
      var colors = commodities.getColors(c.key, steps);
      c.scale = d3.scale.quantize()
        .domain(c.extent)
        .range(colors);
    });

    // sort by commodity ascending
    entries.sort(function(a, b) {
      return d3.ascending(a.key, b.key);
    });

    var div = d3.select('#commodities')
      .selectAll('section.commodity')
      .data(entries)
      .enter()
      .append('section')
        .attr('class', 'commodity')
        .attr('id', function(d) {
          return d.id = commodityId(d.key);
        })
        .style('border-color', function(d) {
          return commodities.getPrimaryColor(d.key);
        });

    div.append('h2')
      .attr('class', 'section__title')
      .append('a')
        .attr('href', function(d) { return '#' + d.id; })
        .text(function(d) { return d.key; });

    var content = div.append('div')
      .attr('class', 'content');

    var legend = content.append('ol')
      .attr('class', 'legend');

    var formatRange = eiti.format.range(eiti.format.shortDollars, '&mdash;');
    var item = legend.selectAll('li')
      .data(function(d) {
        var scale = d.scale;
        return scale.range().map(function(color) {
          return {
            color: color,
            extent: scale.invertExtent(color)
          };
        });
      })
      .enter()
      .append('li')
        .style('width', (100 / steps).toFixed(1) + '%')
        .style('border-color', function(d) {
          return d.color;
        })
        .append('span')
          .html(function(d) {
            return formatRange(d.extent);
          });

    var svg = content.append('svg')
      .attr('class', 'map')
      .attr('viewBox', [0, 0].concat(size).join(' '));

    var g = svg.append('g')
      .attr('class', 'features states');

    var states = data.geo.states.features;
    // TODO: sort spatially?

    var tip = eiti.ui.tip()
      .attr('class', 'tooltip')
      .direction('n')
      .offset([8, 0]) // nestle up a bit
      .html(function(d) {
        // note: d.label is set in updateCommodityMaps()
        return d.label;
      });

    svg.call(tip);

    var feature = g.selectAll('g.state')
      .data(function(d) {
        var commodity = d.key;
        // XXX: only render states that have data for a commodity?
        return states.map(function(feature) {
          var state = feature.properties.abbr;
          return {
            state: state,
            feature: feature,
            commodity: d,
            value: d.value[state] || {}
          };
        });
      })
      .enter()
      .append('g')
        .attr('class', 'state')
        .attr('tabindex', 0)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .on('focus', tip.show)
        .on('blur', tip.hide);

    feature.append('path')
      .attr('class', 'state')
      .attr('id', function(d) {
        return 'state-feature-' + d.state;
      })
      .attr('d', function(d) {
        return path(d.feature);
      })
      .attr('fill', '#fff')
      .append('title');

    feature.append('text')
      .attr('class', 'label')
      .attr('text-anchor', 'middle')
      .attr('dy', '.4em')
      .attr('transform', function(d) {
        var c = path.centroid(d.feature);
        return 'translate(' + c + ')';
      });

    svg.append('use')
      .attr('xlink:href', '#states-mesh');
  }

  function updateCommodityMaps(state) {
    var year = state.year;
    var states = d3.selectAll('section.commodity g.state')
      .each(function(d) {
        var value = (year in d.value)
          ? eiti.format.shortDollars(d.value[year])
          : '';
        d.label = (value
          ? [d.state, ': ', value, ' in ', year]
          : [d.state, ': no revenues in ', year]).join('');
      });
    states.transition()
      .duration(250)
      .select('path')
        .attr('fill', function(d) {
          var value = d.value[year];
          return value ? d.commodity.scale(value) : '#fff';
        });
  }

  // normalize a string for use as a fragment identifier
  function normalize(str) {
    return str.toLowerCase()
      .replace(/\s*&\s*/g, '-')
      .replace(/ /g, '_');
  }

  /*
   * sets the margin of the <body> to the height of the footer,
   * so content will never slide underneath it.
   *
   * TODO: debounce or defer this so it's not called so frequently.
   */
  function resize() {
    var footer = document.querySelector('footer');
    var rect = footer.getBoundingClientRect();
    d3.select('body')
      .style('margin-bottom', rect.height + 'px');
  }

  exports.data = data;
  exports.state = state;
  exports.update = update;

})(this);

