(function(exports) {

  // symbols for "private" variables
  var DATA = '__es_data__';
  var SELECTED = '__es_selected__';

  var observedAttributes = ['x-range', 'data', 'selected'];

  // global dimensions
  var width = 600;
  var height = 200;
  var margin = 20;
  var left = margin;
  var right = width - margin;
  var top = margin;
  var bottom = height - margin;

  var attached = function() {
    var svg = d3.select(this)
      .append('svg')
        .attr('viewBox', [0, 0, width, height].join(' '));
    svg.append('path')
      .attr('class', 'data line');
    svg.append('circle')
      .attr('class', 'data point selected')
      .attr('r', 6);
    svg.append('g')
      .attr('class', 'axis x-axis');

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
        data.push({x: x, y: 0});
      }
    });

    var ymax = d3.max(data, function(d) { return d.y; });
    // console.log('y-max:', ymax);

    var y = d3.scale.linear()
      .domain([0, ymax])
      .range([bottom, top]);

    var svg = d3.select(this).select('svg');
    var line = d3.svg.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); });

    data.sort(function(a, b) {
      return d3.ascending(+a.x, +b.x);
    });

    svg.select('.line')
      .datum(data)
      .attr('d', line(data));

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
        return d[value] ? x(d[value].x) : -100;
      })
      .attr('cy', function(d) {
        return d[value] ? y(d[value].y) : -100;
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

  Object.defineProperty(EITILineChart, 'observedAttributes', {
    get: function() {
      return observedAttributes;
    }
  });

  exports.EITILineChart = EITILineChart;

})(this);
