(function(exports) {

  var eiti = exports.eiti;

  var getter = eiti.data.getter;

  eiti.charts = {};

  /**
   * An area chart generator for d3.
   *
   * @example
   * var area = eiti.charts.area()
   *   .x(function(d) { return d.year; })
   *   .y(function(d) { return d.category; })
   *   .value(function(d) { return d.value; });
   *
   * d3.select('svg')
   *   .call(area, [
   *      {year: 2000, category: 'x', value: 10},
   *      {year: 2001, category: 'x', value: 12},
   *      // ...
   *      {year: 2010, category: 'y', value: 8}
   *   ]);
   * @name eiti.charts.area
   * @returns {areaChart}
   */
  eiti.charts.area = function() {
    var dx = getter('Year');
    var dy = getter('Commodity');
    var value = getter('Revenue');
    var stacked = false;
    var log = false;

    var width = 960;
    var height = 100;

    var margin = {
      top: 10,
      bottom: 25,
      left: 50,
      right: 20
    };

    var axisSpacing = 5;

    var fill = (function() {
      var scale = d3.scale.category10();
      return function(d) { return scale(d.key); };
    })();

    var sort = function(a, b) {
      return d3.descending(a.sum, b.sum);
    };

    var interpolate = 'monotone';

    var voronoi = false;

    /**
     * Renders a chart in a given d3 selection. Use {@link
     * eiti.charts.area} to create one.
     *
     * @namespace areaChart
     * @param {d3.selection} svg  a d3 `<svg>` element selection
     * @param {Array=} data optional data
     */
    var areaChart = function(svg, data) {
      if (data) {
        svg.datum
          ? svg.datum(data)
          : svg.each(function() {
              d3.select(this).datum(data);
            });
      } else {
        data = svg.datum() || [];
      }
      svg.attr('viewBox', [0, 0, width, height].join(' '));

      var index = d3.nest()
        .key(dy)
        .key(dx)
        .rollup(function(d) {
          return d3.sum(d, value);
        })
        .map(data);

      var xs = d3.extent(data, dx).map(Number);
      var ys = d3.keys(index);
      var xd = d3.range(xs[0], xs[1] + 1);
      var layers = ys.map(function(y) {
        return xd.map(function(x) {
          var z = index[y][x] || 0;
          if (stacked && z < 0) z = 0;
          return {
            x: x,
            y: z,
            key: y
          };
        });
      });

      layers.forEach(function(d) {
        d.key = d[0].key;
        d.sum = d3.sum(d, getter('y'));
      });

      layers.sort(sort);

      var aggr = stacked ? d3.sum : d3.max;
      var yd = d3.extent(xd, function(x, i) {
        return aggr(layers, function(d) {
          return d[i].y;
        });
      });

      var y0 = height - margin.bottom;
      var y1 = margin.top;

      var y = log
        ? d3.scale.log()
          .domain([1, yd[1]])
          .range([y0, y1])
          .clamp(true)
        : d3.scale.linear()
          .domain([0, yd[1]])
          .range([y0, y1]);
      y.nice();

      var x = d3.scale.linear()
        .domain(d3.extent(data, dx))
        .range([margin.left, width - margin.right]);

      var yAxis = d3.svg.axis()
        .orient('left')
        .scale(y);

      var si = d3.format('s');
      var suffix = {K: 'k', M: 'm', G: 'b'};
      var ticks = 3;
      var yFormat = function(n, i) {
        var p = '$';
        return p + si(n).replace(/[KMG]$/, function(s) {
          return suffix[s] || s;
        });
      };

      if (log) {
        ticks -= 1;
        yAxis.ticks(ticks, yFormat);
      } else {
        yAxis.ticks(ticks)
          .tickFormat(yFormat);
      }

      var gy = svg.select('g.axis.y');
      if (gy.empty()) {
        gy = svg.append('g')
          .attr('class', 'axis y');
      }
      gy.attr('transform', 'translate(' + [margin.left - axisSpacing, 0] + ')')
        .call(yAxis);

      var gx = svg.select('g.axis.x');
      if (gx.empty()) {
        gx = svg.append('g')
          .attr('class', 'axis x');
      }
      gx.attr('transform', 'translate(' + [0, height - margin.bottom + axisSpacing] + ')')
        .call(d3.svg.axis()
          .orient('bottom')
          .scale(x)
          .tickFormat(d3.format('d')));

      var stack = d3.layout.stack()
        .order('reverse');

      svg.each(function() {
        var g = d3.select(this)
          .selectAll('g.layer')
            .data(stack(layers));

        g.exit().remove();

        g.enter()
          .append('g')
            .attr('class', 'layer')
            .append('a')
              .append('path')
                .attr('class', 'area')
      });

      var g = svg.selectAll('g.layer');

      var area = d3.svg.area()
        .interpolate(interpolate)
        .x(function(d) { return x(d.x); });

      if (stacked) {
        area
          .y0(function(d) { return y(d.y0); })
          .y1(function(d) { return y(d.y + d.y0); });
      } else {
        area
          .y0(y(0))
          .y1(function(d) { return y(d.y); });
      }

      var paths = g.select('path')
        .attr('fill', fill)
        .attr('d', area);

      if (voronoi) {
        var points = [];
        paths.each(function(d) {
          d.forEach(function(v) {
            var _y = stacked
              ? v.y0 + v.y
              : v.y;
            points.push({
              data: d,
              value: v,
              x: x(v.x),
              y: y(_y)
            });
          });
        });

        var vor = eiti.charts.voronoi()
          .points(points)
          .clipExtent([
            [margin.left - axisSpacing, margin.top],
            [width - margin.right + axisSpacing, height - margin.bottom + axisSpacing]
          ]);

        var regions = svg.select('g.voronoi');
        if (regions.empty()) {
          regions = svg.append('g')
            .attr('class', 'voronoi');
        }

        /*
        regions.call(vor)
          .selectAll('*')
            // NB: you have to do this to revert the data "back"
            // to its pre-voronoi() state
            .datum(function(d) {
              return d.point.value;
            });
        */
      }
    };

    /**
     * Get or set the chart's data.
     *
     * @param {Array=} data set the chart's data, or get the
     *                      previously set data.
     */
    areaChart.data = function(_) {
      if (!arguments.length) return data;
      data = _;
      return areaChart;
    };

    /**
     * Get or set the chart's margin in pixels.
     *
     * @example
     * var margin = areaChart.margin();
     * areaChart.margin({top: 0, right: 20, bottom: 30, left: 10});
     * areaChart.margin([0, 100]); // NB: [y, x]
     * areaChart.margin(20); // 20 on all sides
     *
     * @param {*=} margin set the margin as returned by {@link eiti.ui.margin}.
     */
    areaChart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = eiti.ui.margin(_);
      return areaChart;
    };

    /**
     * Get or set the chart's layer sort comparator.
     * @param {Function=} sort
     */
    areaChart.sort = function(_) {
      if (!arguments.length) return sort;
      sort = d3.functor(_);
      return areaChart;
    };

    /**
     * Get or set the chart's horizontal value accessor.
     *
     * @example
     * var x = areaChart.x();
     * areaChart.x(function(d) { return d.Year; });
     * areaChart.x('Year'); // same as above
     *
     * @param {String|Function=} x set the horizontal value accessor
     */
    areaChart.x = function(_) {
      if (!arguments.length) return dx;
      dx = (typeof _ === 'string')
        ? getter(_)
        : d3.functor(_);
      return areaChart;
    };

    /**
     * Get or set the chart's *layer group* accessor.
     *
     * @example
     * var y = areaChart.y();
     * areaChart.y(function(d) { return d.Commodity; });
     * areaChart.y('Commodity'); // same as above
     *
     * @param {String|Function=} y set the layer group accessor
     */
    areaChart.y = function(_) {
      if (!arguments.length) return dy;
      dy = (typeof _ === 'string')
        ? getter(_)
        : d3.functor(_);
      return areaChart;
    };

    /**
     * Get or set the chart's vertical (numeric) value accessor.
     *
     * @example
     * var value = areaChart.value();
     * areaChart.value(function(d) { return d.Revenue; });
     * areaChart.value('Revenue'); // same as above
     *
     * @param {String|Function=} v set the vertical value accessor
     */
    areaChart.value = function(_) {
      if (!arguments.length) return value;
      value = (typeof _ === 'string')
        ? getter(_)
        : d3.functor(_);
      return areaChart;
    };

    /**
     * Toggle stacking layout. Area charts are not stacked by
     * default.
     *
     * @example
     * var stacked = areaChart.stacked();
     * areaChart.stacked(true); // tell it to stack
     *
     * @param {Boolean=} stacked if `true`, enabled stacking layout
     */
    areaChart.stacked = function(_) {
      if (!arguments.length) return stacked;
      stacked = !!_;
      return areaChart;
    };

    /**
     * Toggle logarithmic y-axis scaling.
     *
     * @example
     * var log = areaChart.log();
     * areaChart.log(true); // use logarithmic scaling
     *
     * @param {Boolean=} log if `true`, enabled logarithmic scaling
     */
    areaChart.log = function(_) {
      if (!arguments.length) return log;
      log = !!_;
      return areaChart;
    };

    /**
     * Get or set the layer fill accessor.
     *
     * @example
     * var fill = areaChart.fill();
     * areaChart.fill(d3.scale.category20());
     * areaChart.fill(function(d, i) {
     *   return i % 2 ? 'yellow' : 'orange';
     * });
     * areaChart.fill('red');
     *
     * @param {*=} fill set the fill accessor
     */
    areaChart.fill = function(_) {
      if (!arguments.length) return fill;
      fill = d3.functor(_);
      return areaChart;
    };

    areaChart.width = function(_) {
      if (!arguments.length) return width;
      width = +_;
      return areaChart;
    };

    areaChart.height = function(_) {
      if (!arguments.length) return height;
      height = +_;
      return areaChart;
    };

    /**
     * Toggle creation of Voronoi regions for interactivity.
     *
     * @param {Boolean=} voronoi if `true`, voronoi regions will be created
     */
    areaChart.voronoi = function(_) {
      if (!arguments.length) return voronoi;
      voronoi = _;
      return areaChart;
    };

    return areaChart;
  };

  eiti.charts.voronoi = function() {
    var points = [];
    var clipExtent = null;

    var chart = function(svg) {
      var voronoi = d3.geom.voronoi()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .clipExtent(clipExtent);

      var region = svg.selectAll('g.region')
        .data(voronoi(points));

      region.exit().remove();

      var enter = region.enter()
        .append('g')
          .attr('class', 'region');
      var a = enter.append('a')
        .attr('class', 'region');
      a.append('path')
        .attr('fill', 'transparent');
      a.append('circle')
        .attr('class', 'point');

      region.select('path')
        .attr('d', function poly(v) {
          return 'M' + (v ? v.join('L') : '0,0') + 'Z';
        });

      region.select('circle')
        .attr('transform', function(d) {
          var p = d
            ? [d.point.x, d.point.y].map(Math.round)
            : [-100, -100];
          return 'translate(' + p + ')';
        });
    };

    chart.points = function(_) {
      if (!arguments.length) return points;
      points = _;
      return chart;
    };

    chart.clipExtent = function(_) {
      if (!arguments.length) return clipExtent;
      clipExtent = _;
      return chart;
    };

    return chart;
  };

})(this);
