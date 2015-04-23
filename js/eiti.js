(function(exports) {

  // global eiti namespace
  var eiti = exports.eiti = {};

  // data namespace
  eiti.data = {};

  /**
   * Nest data into an object structure:
   *
   * @example
   *    var data = [{x: 1, y: 2}, {x: 2, y: 2}];
   *    var nested = eiti.data.nest(data, ['x', 'y']);
   *    assert.deepEqual(nested, {
   *      1: {
   *        2: [
   *          {x: 1, y: 2}
   *        ]
   *      },
   *      2: {
   *        2: [
   *          {x: 2, y: 2}
   *        ]
   *      }
   *   });
   *
   * @param {Array} rows a dimensional tabular data set
   * @param {Array} keys a list of key functions or property names
   * @param {Function} [rollup=null] an optional value rollup function
   */
  eiti.data.nest = function(rows, keys, rollup) {
    var nest = d3.nest();
    keys.forEach(function(k) {
      nest.key(getter(k));
    });
    if (rollup) nest.rollup(rollup);
    return nest.map(rows);
  };

  /**
   * Commodity grouping and color model.
   *
   * @class
   */
  eiti.data.Commodities = (function() {
    var Commodities = function() {
      if (!(this instanceof Commodities)) return new Commodities();
      this.groups = d3.set([
        'Coal',
        'Gas',
        'Geothermal',
        'Oil',
        'Oil & Gas',
        Commodities.OTHER
      ]);

      this.groupMap = {
        'Oil Shale': 'Oil'
      };

      this.groupColors = {
        'Coal': 'YlOrBr',
        'Oil': 'Greys',
        'Gas': 'Purples',
        'Oil & Gas': 'RdPu',
        'Geothermal': 'OrRd',
        'Other Commodities': 'Blues'
      };
    };

    Commodities.OTHER = 'Other Commodities';

    Commodities.prototype.getGroup = function(commodity) {
      if (this.groups.has(commodity)) return commodity;
      return this.groupMap[commodity] || Commodities.OTHER;
    };

    Commodities.prototype.setGroup = function(commodity, group) {
      this.groupMap[commodity] = group;
      return this;
    };

    Commodities.prototype.getGroups = function() {
      return this.groups.values();
    };

    Commodities.prototype.getColors = function(commodity, steps) {
      if (this.groups.has(commodity)) {
        commodity = this.getGroup(commodity);
      }
      var scheme = this.groupColors[commodity] || 'Spectral';
      return colorbrewer[scheme][steps || 9];
    };

    return Commodities;
  })();

  /**
   * A data model for storing named datasets.
   * @class
   */
  eiti.data.Model = (function() {

    var Model = function(data) {
      if (!(this instanceof Model)) return new Model(data);
      this.data = d3.map(data);
    };

    Model.prototype.has = function(name) {
      return this.data.has(name);
    };

    Model.prototype.get = function(name) {
      return this.data.get(name);
    };

    Model.prototype.set = function(name, data) {
      return this.data.set(name, data);
    };

    Model.prototype.load = function(name, url, done) {
      if (this.has(name)) {
        return done(null, this.get(name));
      }
      var ext = url.split('.').pop();
      var load = d3[ext || 'json'];
      return load(url, function(error, data) {
        if (error) return done(error);
        this.set(name, data);
        done(null, data);
      }.bind(this));
    };

    Model.prototype.createIndex = function(src, dest, keys, rollup) {
      if (this.has(dest)) return this.get(dest);
      var data = this.get(src);
      var index = eiti.data.nest(data, keys, rollup);
      this.set(dest, index);
      return index;
    };

    function getIndexKey(name, keys) {
      return name + ':' + keys.join('/');
    }

    return Model;
  })();

  eiti.data.getter = getter;

  eiti.ui = {};

  /**
   * Create a slider from a d3 selection that dispatches 'change'
   * events whenever the element is clicked, tapped or dragged.
   *
   * @example
   *
   *  var slider = eiti.ui.slider()
   *    .range([0, 100])
   *    .on('change', function(e) {
   *      console.log('slider value:', e.value);
   *    });
   *  d3.select('#slider')
   *    .call(slider);
   */
  eiti.ui.slider = function() {

    var slider = function(selection) {
      root = selection;
      // XXX don't capture right-clicks (for inspecting)
      selection.on('mousedown', function() {
        var e = d3.event;
        if (e.button === 2) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });
      selection.call(drag);
      if (typeof value !== 'undefined') {
        slider.update(root);
      }
    };

    var root, value;
    var dragging = false;

    var nub = '.nub';
    var scale = d3.scale.linear()
      .clamp(true);

    var snap = false;
    var dispatch = d3.dispatch('change');
    var format = String;

    function drag(selection) {
      selection.on('mousedown.slider', function() {
        // console.log('[drag] down');
        dragging = true;
        var body = d3.select('body').on('mouseup.slider', function() {
          // console.log('[drag] up');
          dragging = false;
          body.on('mouseup.slider', null);
        });
        move(d3.event);
      })
      .on('mousemove.slider', function() {
        if (dragging) {
          // console.log('[drag] move');
          move(d3.event);
          return false;
        }
      });
    }

    function move(e) {
      var p = getPosition(e),
          w = getWidth(root.node()),
          x = Math.max(0, Math.min(p.x, w)),
          u = x / w,
          v = scale(u);

      // console.log('[slider] drag:', [p.x, p.y].join(','), [w, x, u, v].join(' '));

      if (value != v) {
        value = v;
        dispatch.change({
          x: x,
          u: u,
          value: value,
          sourceEvent: e.sourceEvent
        });
      }

      root.each(update);
    }

    function getPosition(e) {
      var p = e.type === 'touchstart'
        ? d3.touches(root.node())[0]
        : d3.mouse(root.node());
      return {x: p[0], y: p[1]};
    }

    slider.nub = function(selector) {
      if (arguments.length) {
        nub = selector;
        return slider;
      } else {
        return nub;
      }
    };

    slider.range = function(range) {
      if (arguments.length) {
        scale.range(range);
        return slider;
      } else {
        return scale.range();
      }
    };

    slider.snap = function(x) {
      if (arguments.length) {
        snap = x;
        var range = scale.range();
        if (snap) {
          scale.rangeRound(range);
        } else {
          scale.range(range);
        }
        return slider;
      } else {
        return snap;
      }
    };

    slider.value = function(x) {
      if (arguments.length) {
        value = +x;
        if (root && !dragging) {
          slider.update(root);
        }
        return slider;
      } else {
        return value;
      }
    };

    slider.update = function(selection) {
      selection.each(update);
    };

    function update() {
      var left = scale.invert(value) * 100;
      d3.select(this).select(nub)
        .style('left', left + '%')
        .select('.value')
          .text(format(value));
    }

    function dragstart() {
      var e = d3.event,
          o = e.sourceEvent,
          p = o.type === 'touchstart'
            ? d3.touches(root.node())[0]
            : d3.mouse(root.node());
      e.x = p[0];
      e.y = p[1];
      dragging = true;
      dragmove();
    }

    function dragmove() {
      var e = d3.event,
          w = getWidth(root.node()),
          x = Math.max(0, Math.min(e.x, w)),
          u = x / w,
          v = scale(u);

      // console.log('[slider] move:', [e.x, e.y], [w, x, u, v]);

      if (value != v) {
        value = v;
        dispatch.change({
          x: x,
          u: u,
          value: value,
          sourceEvent: e.sourceEvent
        });
      }

      root.each(update);
    }

    function dragend() {
      var e = d3.event;
      // console.log('[drag] end');
      dragging = false;
    }

    function getWidth(node) {
      return node.getBoundingClientRect().width;
    }

    d3.rebind(slider, dispatch, 'on');
    return slider;
  };

  /**
   * Create a margin object {top, right, left, bottom} from any 
   * of the following types:
   *
   * - string: coerce to a number
   * - number: a margin object with equal top, right, left and
   *   bottom values
   * - array: read the values as [top, right, bottom, left] if there
   *   are 4 or more elements; otherwise read as [vertical,
   *   horizontal]
   * - object: set top, right, bottom and left keys to 0 if not set,
   *   then return the object
   *
   * @param {*} input
   */
  eiti.ui.margin = function(d) {
    switch (typeof d) {
      case 'string':
        d = +d || 0;
      case 'number':
        return {left: d, top: d, right: d, bottom: d};
      case 'undefined':
        return {left: 0, top: 0, right: 0, bottom: 0};
    }
    if (Array.isArray(d)) {
      return d.length >= 4
        ? {top: d[0], right: d[1], bottom: d[2], left: d[3]}
        : {top: d[0], right: d[1], bottom: d[0], left: d[1]};
    }
    ['top', 'right', 'bottom', 'left'].forEach(function(k) {
      if (!d.hasOwnProperty(k)) d[k] = 0;
    });
    return d;
  };

  eiti.util = {};

  /**
   * Force a reset of location.hash so that the browser (hopefully)
   * scrolls to the element with the fragment identifier and toggles
   * the :target pseudo-class.
   */
  eiti.util.jiggleHash = function() {
    var hash = location.hash;
    if (hash) {
      location.hash = '';
      location.hash = hash;
      return true;
    }
    return false;
  };

  function getter(key) {
    if (typeof key === 'function') return key;
    return function(d) { return d[key]; };
  }

})(this);
