(function(exports) {

  // symbols for "private" variables
  var DATA = '__es_data__';
  var SELECTED = '__es_selected__';

  var observedAttributes = ['x-range', 'data', 'selected'];

  // global dimensions
  var width = 300;
  var height = 100;
  var dotRadius = 8;
  var baseMargin = 16;
  var margin = {
    top: dotRadius + 1,
    right: baseMargin,
    bottom: baseMargin + dotRadius,
    left: baseMargin
  };

  var left = margin.left;
  var right = width - margin.right;
  var top = margin.top;
  var bottom = height - margin.bottom;

  var attached = function() {
    var svg = d3.select(this)
      .append('svg')
        .attr('viewBox', [0, 0, width, height].join(' '));
    /*
    svg.append('path')
      .attr('class', 'data area');
    */
    svg.append('g')
      .attr('class', 'axis x-axis');
    svg.append('path')
      .attr('class', 'data line');
    svg.append('circle')
      .attr('class', 'data point selected')
      .attr('r', dotRadius);

    observedAttributes.forEach(function(attr) {
      if (this.hasAttribute(attr)) {
        attributeChanged.call(this, attr, null, this.getAttribute(attr));
      }
    }, this);
  };

  var attributeChanged = function(name, previous, value) {
    switch (name) {
      case 'x-range':
        this.xrange = JSON.parse(value);
        break;
      case 'data':
        this.data = JSON.parse(value);
        break;
      case 'selected':
        this.selected = value;
        break;
    }
  };

  var detached = function() {
  };

  var update = function() {
    var data = this.data;
    var values = data;

    if (Array.isArray(data)) {
      values = d3.nest()
        .key(function(d) { return d.x; })
        .rollup(function(d) { return d[0]; })
        .entries(data);
    } else {
      values = Object.keys(data).reduce(function(map, key) {
        map[key] = {x: +key, y: data[key]};
        return map;
      }, {});
      data = Object.keys(data).map(function(key) {
        return {x: +key, y: data[key]};
      });
    }

    // console.log('data:', data, 'values:', values);

    var xrange = this.xrange;
    if (!xrange) {
      xrange = d3.extent(data, function(d) { return +d.x; });
    }

    var xdomain = d3.range(xrange[0], xrange[1] + 1);
    var x = d3.scale.linear()
      .domain(xrange)
      .range([left, right]);

    xdomain.forEach(function(x) {
      if (!values[x]) {
        data.push({x: x, y: NaN});
      }
    });

    var extent = d3.extent(data, function(d) { return d.y; });
    var ymax = extent[1];
    var ymin = extent[0]; // XXX 0?

    var y = d3.scale.linear()
      .domain([ymin, ymax])
      .range([bottom, top]);

    var svg = d3.select(this).select('svg');
    var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); })
      .defined(function(d) {
        return !isNaN(d.y);
      });

    data.sort(function(a, b) {
      return d3.ascending(+a.x, +b.x);
    });

    svg.select('.line')
      .datum(data)
      .attr('d', line(data));

    /*
    var area = d3.svg.area()
      .x(line.x())
      .y0(bottom)
      .y1(line.y());

    svg.select('.area')
      .datum(data)
      .attr('d', area(data));
    */

    var x1 = xdomain[xdomain.length - 1];
    var selected = this.selected || x1;
    svg.select('.selected')
      .datum(values)
      .call(updateSelected, selected, x, y);

    this.__x = x;
    this.__y = y;

    var axis = d3.svg.axis()
      .orient('bottom')
      .scale(x)
      .ticks(xdomain.length)
      .innerTickSize(-height)
      .outerTickSize(0)
      .tickPadding(dotRadius + 4)
      .tickFormat(function(x) {
        return String(x).substr(2);
      });

    svg.select('.x-axis')
      .attr('transform', 'translate(' + [0, bottom] + ')')
      .call(axis)
      .selectAll('path, line')
        .attr('fill', 'none');
  };

  var updateSelected = function(circle, value, x, y) {
    circle
      .attr('cx', function(d) {
        return d[value] ? x(d[value].x) : x(value);
      })
      .attr('cy', function(d) {
        return d[value] ? y(d[value].y) : y(0);
      });
  };

  var EITILineChart = document.registerElement('eiti-line-chart', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        attributeChangedCallback: {value: attributeChanged},
        detachedCallback: {value: detached},

        update: {value: update},

        data: {
          get: function() {
            return this[DATA];
          },
          set: function(data) {
            this[DATA] = data;
            this.update();
          }
        },

        selected: {
          get: function() {
            return this[SELECTED];
          },
          set: function(x) {
            this[SELECTED] = x;
            if (this.__x && this.__y) {
              d3.select(this)
                .select('.selected')
                  .call(updateSelected, x, this.__x, this.__y);
            }
          }
        }
      }
    )
  });

  EITILineChart.observedAttributes = observedAttributes;

  exports.EITILineChart = EITILineChart;

})(this);
