(function(exports) {

  // symbols for "private" variables
  var DATA = '__es_data__';
  var X = '__es_x__';

  var observedAttributes = ['x-range', 'data', 'x-value', 'data-units'];

  // global dimensions
  var width = 300;
  var height = 100;

  var textMargin = 18;
  var baseMargin = 2;
  var margin = {
    top: 0,
    right: baseMargin,
    bottom: textMargin,
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
      case 'x-value':
        this.x = value;
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
      xrange = d3.extent(data, function(d) {
        return +d.x;
      });
    }

    var xdomain = d3.range(xrange[0], xrange[1] + 1);

    var x = d3.scale.ordinal()
      .domain(xdomain)
      .rangeBands([left, right]);

    xdomain.forEach(function(x) {
      if (!values[x]) {
        data.push({x: x, y: 0});
      }
    });

    var extent = d3.extent(data, function(d) { return d.y; });
    var ymax = extent[1];
    var ymin = Math.min(0, extent[0]);

    data.sort(function(a, b) {
      return d3.ascending(+a.x, +b.x);
    });

    var barWidth = x.rangeBand();
    var barHeight = bottom - top;

    var height = d3.scale.linear()
      .domain([ymin, ymax])
      .range([0, barHeight]);

    var self = this;
    var selection = d3.select(self);

    var svg = selection.select('svg');

    var bars = svg.selectAll('.bar')
      .data(data);

    var enter = bars.enter()
      .append('g')
        .attr('class', 'bar');
    enter.append('rect')
      .attr('class', 'bar-value');
    enter.append('rect')
      .attr('class', 'bar-mask');

    bars.exit().remove();

    bars.attr('transform', function(d) {
      return 'translate(' + [x(d.x), 0] + ')';
    });

    bars.select('.bar-value')
      .attr('height', function(d) {
        return d.height = height(d.y);
      })
      .attr('y', function(d) {
        return barHeight - d.height;
      })
      .attr('width', barWidth);

    svg.selectAll('.bar-mask')
      // extend all the way to the bottom of the screen
      .attr('height', barHeight + textMargin * 2)
      .attr('width', barWidth);

    selection.call(updateSelected, this.x);

    bars.on('mouseover', function(d) {
      selection.call(updateSelected, d.x);
    }, true);

    svg.on('mouseout', function() {
      selection.call(updateSelected, self.x);
    }, true);

    var axis = d3.svg.axis()
      .orient('bottom')
      .scale(x)
      .ticks(xdomain.length)
      .tickSize(0)
      .tickPadding(4)
      .tickFormat(function(x) {
        return String(x).substr(2);
      });

    svg.select('.x-axis')
      .attr('transform', 'translate(' + [0, bottom] + ')')
      .call(axis)
      .selectAll('path, line')
        .attr('fill', 'none');
  };

  var formatUnits = function(text, units) {
    if (units === '$' || units === 'dollars') {
      text = [units, text].join(' ');
    } else {
      text = [text, units].join(' ');
    }
    return text;
  }

  var updateSelected = function(selection, x) {
    var index;
    var value = {x: x, y: 0};
    selection.selectAll('.bar')
      .classed('bar-selected', function(d, i) {
        if (d.x === x) {
          index = i;
          value.x = d.x;
          value.y = d.y;
          return true;
        }
      });
    selection.selectAll('.tick')
      .classed('tick-selected', function(d, i) {
        return i === index;
      });

    var id = selection.attr('aria-controls');
    if (id) {
      var output = d3.select('#' + id)
      output.select('.eiti-bar-chart-x-value')
        .text(value.x);
      var y = output.select('.eiti-bar-chart-y-value');
      var format = d3.format(y.attr('data-format') || ',');
      var units = y.attr('data-units');
      y.text(formatUnits(format(value.y),units));
    }
  };

  var EITIBarChart = document.registerElement('eiti-bar-chart', {
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

        x: {
          get: function() {
            return this[X];
          },
          set: function(x) {
            x = +x;
            if (x !== this.x) {
              this[X] = x;
              d3.select(this)
                .call(updateSelected, x);
            }
          }
        },

        y: {
          get: function() {
            var selected = d3.select(this)
              .select('.bar-selected')
              .datum();
            return selected ? selected.y : undefined;
          }
        }
      }
    )
  });

  // EITIBarChart.observedAttributes = observedAttributes;

  exports.EITIBarChart = EITIBarChart;

})(this);
