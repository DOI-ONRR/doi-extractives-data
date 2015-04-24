(function(exports) {

  var eiti = exports.eiti;

  var getter = eiti.data.getter;

  eiti.charts = {};

  /**
   * An area chart generator for d3.
   * @class
   * @name eiti.charts.area
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
   */
  eiti.charts.area = function() {
    var dx = getter('Year');
    var dy = getter('Commodity');
    var value = getter('Revenue');
    var stacked = true;
    var log = false;

    var width = 960;
    var height = 100;

    var margin = {
      top: 10,
      bottom: 25,
      left: 50,
      right: 20
    };

    var fill = d3.scale.category10();
    var interpolate = 'cardinal';

    var chart = function(svg, data) {
      if (data) {
        svg.datum(data);
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

      layers.sort(function(a, b) {
        return d3.descending(a.sum, b.sum);
      });

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
        var p = (i === 0 || i === ticks) ? '$' : '';
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

      svg.append('g')
        .attr('class', 'axis y')
        .attr('transform', 'translate(' + [margin.left - 2, 0] + ')')
        .call(yAxis);

      svg.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(' + [0, height - margin.bottom + 2] + ')')
        .call(d3.svg.axis()
          .orient('bottom')
          .scale(x)
          .tickFormat(d3.format('d')));

      var stack = d3.layout.stack();

      var g = svg.selectAll('g.layer')
        .data(stack(layers))
        .enter()
        .append('g')
          .attr('class', 'layer')
          .append('a');

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

      var paths = g.append('path')
        .attr('fill', function(d) {
          return fill(d.key);
        })
        .attr('d', area);
    };

    /**
     * @instance
     * @method
     * @memberof! eiti.charts.area#
     */
    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = eiti.ui.margin(_);
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return dx;
      dx = (typeof _ === 'string')
        ? getter(_)
        : d3.functor(_);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return dy;
      dy = (typeof _ === 'string')
        ? getter(_)
        : d3.functor(_);
      return chart;
    };

    chart.value = function(_) {
      if (!arguments.length) return value;
      value = (typeof _ === 'string')
        ? getter(_)
        : d3.functor(_);
      return chart;
    };

    chart.stacked = function(_) {
      if (!arguments.length) return stacked;
      stacked = !!_;
      return chart;
    };

    chart.log = function(_) {
      if (!arguments.length) return log;
      log = !!_;
      return chart;
    };

    chart.fill = function(_) {
      if (!arguments.length) return fill;
      fill = d3.functor(_);
      return chart;
    };

    return chart;
  };

})(this);
