(function(exports) {

  exports.XSparkline = registerElement('x-sparkline', {
    createdCallback: function() {
      var svg = d3.select(this).append('svg');
      svg.append('line');
      svg.append('path');
      svg.append('circle')
        .attr('class', 'dot')
        .attr('r', 3);

      this.values = this.getAttribute('values') || [];
      this.dot = this.getAttribute('dot');
      this.line = this.getAttribute('line');
    },

    attachedCallback: function() {
      this.update();
    },

    detachedCallback: function() {
    },

    attributeChangedCallback: function(attr, prev, value) {
      switch (attr) {
        case 'width':
        case 'height':
          this.querySelector('svg').setAttribute(attr, value);
          this.update();
          break;
        case 'values':
        case 'dot':
        case 'line':
          this[attr] = value;
          break;
      }
    },

    update: function() {
      var svg = d3.select(this).select('svg');

      var values = this.values || [];

      var padding = 4;
      var width = this.hasAttribute('width')
        ? +this.getAttribute('width')
        : 72;
      var height = this.hasAttribute('height')
        ? +this.getAttribute('height')
        : 16;

      svg.attr({
        width: width,
        height: height
      });

      var x = d3.scale.linear()
        .domain([0, values.length - 1])
        .rangeRound([padding, width - padding]);

      var y = d3.scale.linear()
        .domain(d3.extent(values))
        .rangeRound([height - padding, padding]);

      var line = d3.svg.line()
        .x(function(d, i) { return x(i); })
        .y(function(d, i) { return y(d); })
        .defined(function(d) { return !isNaN(d); });

      svg.select('path')
        .datum(values)
        .attr('d', line);

      var line = svg.select('line');
      var lineValue = this.line;
      if (typeof lineValue === 'number') {
        var y0 = y(lineValue);
        // console.log('line @', lineValue, y0);
        line
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', y0)
          .attr('y2', y0)
          .attr('visibility', null);
      } else {
        line.attr('visibility', 'hidden');
      }

      var dot = this.dot;
      var circle = svg.select('.dot');
      if (typeof dot === 'number' && dot >= 0 && dot < values.length) {
        // console.log('dot @', dot, values[dot]);
        circle
          .attr('visibility', null)
          .attr('cx', x(dot))
          .attr('cy', y(values[dot]));
      } else {
        circle.attr('visibility', 'hidden');
      }
    },

    values: accessor('value', parseValues, null, function(values) {
      this.update();
    }),

    dot: accessor('dot', parseNumber, null, function(value) {
      this.update();
    }),

    line: accessor('line', parseNumber, null, function(value) {
      this.update();
    })
  });

  var events = {
  };

  function getListener(type, obj) {
    var key = '__' + type;
    return obj[key] || (obj[key] = events[type].bind(obj));
  }

  function registerElement(name, proto, parent) {
    if (!parent) parent = HTMLElement;
    for (var key in proto) {
      if (typeof proto[key] === 'function') {
        proto[key] = {value: proto[key]};
        if (key.indexOf('__') === 0) {
          proto[key].enumerable = false;
        }
      }
    }
    return document.registerElement(name, {
      prototype: Object.create(
        parent.prototype,
        proto
      )
    });
  }

  function accessor(name, parse, format, change) {
    var key = '__' + name;
    return {
      enumerable: false,
      get: function() {
        var val = this[key];
        return format
          ? format.call(this, val, key)
          : val;
      },
      set: function(value) {
        if (parse) value = parse.call(this, value, name);
        if (value !== this[key]) {
          this[key] = value;
          if (change) change.call(this, value, key);
        }
      }
    };
  }

  function parseNumber(str) {
    // console.log('parseNumber(', str, ')');
    if (typeof str === 'number') return str;
    return str && str.length ? Number(str) : null;
  }

  function parseBoolean(str) {
    return String(str) === 'true';
  }

  function parseValues(str) {
    if (Array.isArray(str)) return str.map(Number);
    return str.split(/\s*,\s*/).map(Number);
  }

})(this);
