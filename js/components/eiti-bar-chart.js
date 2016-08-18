(function(exports) {

  var eiti = require('./../eiti');
  // symbols for "private" variables
  var DATA = '__es_data__';
  var X = '__es_x__';

  var observedAttributes = ['x-range', 'data', 'x-value', 'data-units'];

  // global dimensions
  var width = 300;
  var height = 160;

  var textMargin = 18;
  var baseMargin = 2;
  var extentMargin = 18;
  var tickPadding = 10;
  var margin = {
    top: extentMargin,
    right: baseMargin,
    bottom: textMargin,
    left: baseMargin
  };

  var left = margin.left;
  var right = width - margin.right;
  var top = margin.top;
  var bottom = height - margin.bottom;
  var barHeight = bottom - top;

  var extentPercent = 0.05; // 5%
  var extentMargin = barHeight * extentPercent;
  var extentLessTop = top;
  top = top + extentMargin;
  var extentTop = top - extentMargin;


  var xAxisLabel = 'years';
  var labelOffset = width / 2;

  var fullHeight = height + textMargin + extentMargin + tickPadding - (2 * baseMargin);
  var extentlessHeight = fullHeight - extentMargin;

  var attached = function() {
    var svg = d3.select(this)
      .append('svg')
        .attr('viewBox', [0, 0, width, fullHeight].join(' '));

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

    // conditional used as proxy for having an extent line
    if (!this.hasAttribute('data-units')) {
      top = extentlessHeight;
      fullHeight = extentlessHeight;
    }

    var data = this.data;
    var values = data;

    if (Array.isArray(data)) {
      values = d3.nest()
        .key(function(d) { return d.x; })
        .rollup(function(d) { return d[0]; })
        .entries(data);


    } else {
      values = Object.keys(data).reduce(function(map, key) {

        // need to add empty fields for the domain of the bar chart
        // to make no data work!!!
        map[key] = {x: +key, y: data[key]};
        return map;
      }, {});
      data = Object.keys(data).map(function(key) {
        return {x: +key, y: data[key]};
      });
    }


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
      if (!values[x] && values[x] !== null) {
        data.push({x: x, y: undefined});
      }
    });

    var barWidth = x.rangeBand();
    var barHeight = bottom - top;

    // filter the data so that only values within the domain
    // are included in calculations and rendering
    data = data.filter(function(d) {
      return xdomain.indexOf(d.x) > -1;
    });

    var extent = d3.extent(data, function(d) { return d.y; });
    var ymax = extent[1];
    var ymin = Math.min(0, extent[0]);

    data.sort(function(a, b) {
      return d3.ascending(+a.x, +b.x);
    });

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
      return 'translate(' + [x(d.x), top] + ')';
    });

    bars.select('.bar-value')
      .attr('height', function(d) {
        return d.height = height(d.y) || 0;
      })
      .attr('y', function(d) {
        return barHeight - d.height;
      })
      .attr('width', barWidth);

    svg.selectAll('.bar-mask')
      // extend all the way to the bottom of the screen
      .attr('height', barHeight + textMargin + tickPadding)
      .attr('width', barWidth);

    selection.call(updateSelected, this.x);

    bars.on('mouseover', function(d) {
      selection.call(updateSelected, d.x, true);
    }, true);

    svg.on('mouseout', function() {
      selection.call(updateSelected, self.x, true);
    }, true);

    var axis = d3.svg.axis()
      .orient('bottom')
      .scale(x)
      .ticks(xdomain.length)
      .tickSize(0)
      .tickPadding(tickPadding)
      .tickFormat(function(x) {
        return String(x).substr(2);
      });

    svg.append('g')
      .attr('class', 'x-axis-baseline')
      .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('transform', 'translate(' + [0, bottom] + ')');

    // conditional used as proxy for having an extent line
    if (this.hasAttribute('data-units') && +ymax > 0) {
    var extentLine = svg.append('g')
        .attr('class', 'extent-line')

      var dataUnits = this.getAttribute('data-units'),
      dataFormat = this.getAttribute('data-format') || '';

      if (dataUnits.indexOf('$') > -1) {
        dataFormat = eiti.format.dollars;
        dataUnits = null;
      } else {
        dataFormat = eiti.format.si;
      }

      var dataText = dataFormat(Math.ceil(+ymax * (1 + extentPercent)));
      var extentText = [ dataText, dataUnits ].join(' ');

      extentLine.append('text')
        .text(extentText)
        .attr('transform', 'translate(' + [0, extentTop - 5] + ')');

      extentLine.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('transform', 'translate(' + [0, extentTop] + ')');
    }

    var xAxis = svg.select('.x-axis')
        .attr('transform', 'translate(' + [0, bottom] + ')')
        .call(axis);

    function isInSet (year, vals) {
      var vals = vals || values;
      if (vals[year] !== undefined) {
        return vals[year].y !== null;
      } else {
        return vals[year];
      }
    }

    xAxis.selectAll('text')
      .attr('class', function(d) {
        if (!isInSet(d)){
          return 'dataless';
        }
      });

    xAxis.selectAll('path, line')
        .attr('fill', 'none');

    svg.append('g')
      .attr('class', 'x-axis-label')
      .append('text')
        .text(xAxisLabel)
        .attr('transform', function(d) {
          return 'translate(' + [labelOffset, fullHeight] + ')';
        });
  };

  var formatUnits = function(text, units) {
    if (units === '$' || units === 'dollars') {
      text = [units, text].join(' ');
    } else {
      text = [text, units].join(' ');
    }
    return text;
  }

  var hideCaption = function(selection, data, noData, withheld) {
    selection.select('.caption-data')
      .attr('aria-hidden', data);
    selection.select('.caption-no-data')
      .attr('aria-hidden', noData);
    selection.select('.caption-withheld')
    .attr('aria-hidden', withheld);
  }

  var updateSelected = function(selection, x, hover) {
    var index;
    var value = {x: x, y: undefined};

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

    selection.selectAll('.tick')
      .classed('tick-hover', function(d, i) {
        return hover && i === index;
      }, true);

    var id = selection.attr('aria-controls');
    if (id) {
      var output = d3.select('#' + id)
      output.selectAll('.eiti-bar-chart-x-value')
        .text(value.x);
      var y = output.selectAll('.eiti-bar-chart-y-value');
      var format = d3.format(y.attr('data-format') || ',');
      var units = y.attr('data-units');

      if (value.y === null) {
        hideCaption(output, true, true, false);
      } else {
        if (value.y === undefined) {
          hideCaption(output, true, false, true);
        } else {
          hideCaption(output, false, true, true);
          y.text(formatUnits(format(value.y),units));
        }
      }

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
