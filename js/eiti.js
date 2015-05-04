(function(exports) {

  /*
   * @namespace eiti
   */
  var eiti = exports.eiti = {};

  /*
   * data classes and functions
   */
  eiti.data = {};

  /**
   * Nest data into an object structure:
   * @name eiti.data.nest
   *
   * @example
   * var data = [{x: 1, y: 2}, {x: 2, y: 2}];
   * var nested = eiti.data.nest(data, ['x', 'y']);
   * assert.deepEqual(nested, {
   *   1: {
   *     2: [
   *       {x: 1, y: 2}
   *     ]
   *   },
   *   2: {
   *     2: [
   *       {x: 2, y: 2}
   *     ]
   *   }
   * });
   *
   * @param {Array} rows a dimensional tabular data set
   * @param {Array} keys a list of key functions or property names
   * @param {Function=} rollup an optional value rollup function
   */
  eiti.data.nest = function(rows, keys, rollup) {
    var nest = d3.nest();
    keys.forEach(function(k) {
      nest.key(getter(k));
    });
    if (rollup) nest.rollup(rollup);
    return nest.map(rows);
  };

  function isScalar(d) {
    return typeof d !== 'object';
  }

  /**
   * Walk a nested object structure and call a function on each
   * "leaf" node (that is not an object).
   * @name eiti.data.walk
   *
   * @example
   * var value = [];
   * eiti.data.walk({foo: {bar: 'baz'}}, function(d, i) {
   *   values.push(d);
   * });
   * assert.deepEqual(values, ['baz']);
   *
   * @param {Array|Object} data the array or object to iterate over
   * @param {Function} callback the function to call on each leaf node
   * @return void
   */
  eiti.data.walk = function(struct, each) {
    walk(struct);

    function walk(d, i) {
      if (Array.isArray(d)) {
        return d.forEach(function(v, i) {
          walk.call(d, v, i);
        });
      } else if (typeof d === 'object') {
        return d3.keys(d).forEach(function(key) {
          walk.call(d, d[key], key);
        });
      } else {
        each.call(this, d, i);
      }
    }
  };

  eiti.data.Commodities = (function() {

    /**
     * Commodity grouping and color model.
     * @class
     */
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
        'Coal': 'Greys',
        'Oil': 'YlOrBr',
        'Gas': 'Purples',
        'Oil & Gas': 'RdPu',
        'Geothermal': 'Greens',
        'Other': 'Blues'
      };
    };

    /**
     * The group to which commodities with an unspecified group will
     * be assigned, namely `Other`.
     */
    Commodities.OTHER = 'Other';

    /**
     * Get the nesting group for a given commodity.
     * @param {String} commodity
     * @return {String} the commodity group
     */
    Commodities.prototype.getGroup = function(commodity) {
      commodity = commodity.replace(/\s\([a-z]+\)$/, '');
      if (this.groups.has(commodity)) return commodity;
      return this.groupMap[commodity] || Commodities.OTHER;
    };

    /**
     * Set the nesting group for a given commodity.
     * @method
     * @param {String} commodity
     * @param {String} group
     */
    Commodities.prototype.setGroup = function(commodity, group) {
      this.groupMap[commodity] = group;
      return this;
    };

    /**
     * Get the list of commodity groups as an array.
     * @method
     * @return {Array<String>}
     */
    Commodities.prototype.getGroups = function() {
      return this.groups.values();
    };

    /**
     * Get the colors associated with a commodity's group color
     * scheme.
     * @param {String} commodity the commodity or group
     * @param {Number} steps the number of color steps (default: 9)
     * @return {Array<String>}
     */
    Commodities.prototype.getColors = function(commodity, steps) {
      if (!this.groups.has(commodity)) {
        commodity = this.getGroup(commodity);
      }
      var scheme = this.groupColors[commodity] || 'Spectral';
      return colorbrewer[scheme][steps || 9];
    };

    /**
     * Get the primary color for a commodity group.
     * @param {String} commodity the commodity or group
     * @return {String} a CSS color
     */
    Commodities.prototype.getPrimaryColor = function(commodity) {
      return this.getColors(commodity, 9)[4];
    };

    return Commodities;
  })();

  eiti.data.Model = (function() {

    /**
     * A data model for storing named datasets.
     *
     * @example
     * var model = new eiti.data.Model();
     *
     * @class
     * @alias eiti.data.Model
     * @param {Object|d3.map} data optional datasets to initialize
     */
    var Model = function(data) {
      if (!(this instanceof Model)) return new Model(data);
      this.data = d3.map(data);
    };

    /**
     * @param {String} name the dataset name
     * @return {Boolean} `true` if the named dataset exists, `false` if not
     */
    Model.prototype.has = function(name) {
      return this.data.has(name);
    };

    /**
     * @param {String} name the dataset name
     * @return {Boolean} `true` if the named dataset exists, `false` if not
     */
    Model.prototype.get = function(name) {
      return this.data.get(name);
    };

    /**
     * Store a dataset with a unique key
     * @param {String} name the dataset name
     * @param {*} data the data to store
     * @return {*} returns the data as set
     */
    Model.prototype.set = function(name, data) {
      return this.data.set(name, data);
    };

    /**
     * Load data from a URL into a named dataset.
     *
     * @example
     * model.load('states', 'path/to/states.json', function(error, topology) {
     * });
     *
     * @param {String} name the unique dataset name
     * @param {String} url the URL to load
     * @param {Function=} callback the callback function
     */
    Model.prototype.load = function(name, url, done) {
      if (this.has(name)) {
        return done(null, this.get(name));
      }
      var ext = url.split('.').pop();
      var load = d3[ext || 'json'];
      return load(url, function(error, data) {
        if (error) return done(error);
        this.set(name, data);
        done && done(null, data);
      }.bind(this));
    };

    /**
     * Create a nested index using {@link eiti.data.nest} from a
     * named dataset and alias it to a new name.
     *
     * @example
     * model.set('foo', [
     *   {x: 'bar', y: 'baz'},
     *   {x: 'qux', y: 'quux'}
     * ]);
     * var index = model.createIndex('foo', 'bar', ['x', 'y']);
     * assert.deepEqual(index, {
     *   bar: {
     *     baz: [
     *       {x: 'bar', y: 'baz'}
     *     ],
     *   },
     *   qux: {
     *     quux: [
     *       {x: 'qux', y: 'quux'}
     *     ]
     *   }
     * });
     *
     * @param {String} src the source dataset name
     * @param {String} dest the destination dataset name
     * @param {Array<String|Function>} keys the keys to nest
     * @param {Function=} rollup the optional rollup function
     */
    Model.prototype.createIndex = function(src, dest, keys, rollup) {
      if (this.has(dest)) return this.get(dest);
      var data = this.get(src);
      var index = eiti.data.nest(data, keys, rollup);
      return this.set(dest, index);
    };

    function getIndexKey(name, keys) {
      return name + ':' + keys.join('/');
    }

    return Model;
  })();

  /**
   * Create a key getter function a la Python's
   * itertools.itemgetter().
   * @name eiti.data.getter
   *
   * @example
   * var title = eiti.data.getter('title');
   * var titles = data.map(title);
   *
   * @param {String|Number|Function} key
   * @return {Function}
   */
  eiti.data.getter = getter;

  // UI bits
  eiti.ui = {};

  /**
   * Create an augmented [d3-tip](https://github.com/Caged/d3-tip)
   * instance with "show" and "hide" event dispatching capabilities.
   * EITI tips also have a `.target()` accessor which allows you to
   * override the element that's used to calculate tooltip
   * positioning.
   * @name eiti.ui.tip
   *
   * @example
   * var tip = eiti.ui.tip()
   *   .on('show', function() {
   *     console.log('tip show:', this);
   *   })
   *   .target(function() {
   *     return this.querySelector('circle');
   *   });
   */
  eiti.ui.tip = function() {
    var tip = d3.tip();
    var show = tip.show;
    var hide = tip.hide;
    var dispatch = d3.dispatch('show', 'hide');

    var target = null;

    var showClass = classify('show', 'hide');
    var hideClass = classify('hide', 'show');

    /*
     * Override the target of the tooltip for positioning purposes.
     * @example
     * tip.target(function() {
     *   return this.querySelector('circle');
     * });
     */
    tip.target = function(_) {
      if (!arguments.length) return target;
      target = d3.functor(_);
      return tip;
    };

    tip.show = function() {
      var args = arguments;
      dispatch.show.apply(this, arguments);
      if (target) {
        var t = target ? target.apply(this, arguments) : null;
        if (t) args = [].slice.call(args).concat([t]);
      }
      tip.attr('class', showClass);
      return show.apply(this, args);
    };

    tip.hide = function() {
      dispatch.hide.apply(this, arguments);
      tip.attr('class', hideClass);
      return hide.apply(this, arguments);
    };

    return d3.rebind(tip, dispatch, 'on');
  };

  /**
   * Create a slider from a d3 selection that dispatches 'change'
   * events whenever the element is clicked, tapped or dragged.
   * @name eiti.ui.slider
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
      if (!arguments.length) return nub;
      nub = selector;
      return slider;
    };

    slider.range = function(range) {
      if (!arguments.length) return scale.range();
      scale.range(range);
      return slider;
    };

    slider.snap = function(x) {
      if (!arguments.length) return snap;
      snap = x;
      var range = scale.range();
      if (snap) {
        scale.rangeRound(range);
      } else {
        scale.range(range);
      }
      return slider;
    };

    slider.value = function(x) {
      if (!arguments.length) return value;
      value = +x;
      if (root && !dragging) {
        slider.update(root);
      }
      return slider;
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
   * @name eiti.ui.margin
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
   * Extend objects with additional properties, a la `$.extend()`.
   * @name eiti.util.extend
   *
   * @param {Object} base   the base object onto which all other
   *                        properties will be added
   * @param {Object=} other one or more additional objects with
   *                        properties to be copied
   * @return {Object} the `base` object with added properties
   */
  eiti.util.extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(o) {
      for (var key in o) {
        obj[key] = o[key];
      }
    });
    return obj;
  };

  /**
   * Force a reset of location.hash so that the browser (hopefully)
   * scrolls to the element with the fragment identifier and toggles
   * the :target pseudo-class.
   * @name eiti.util.jiggleHash
   *
   * @return {Boolean}
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

  /**
   * d3 helper for bringing an element to the front among its
   * siblings. Use it with an event listener, e.g.:
   * @name eiti.util.bringToFront
   *
   * @example
   * d3.selectAll('svg path')
   *   .on('mouseover', eiti.util.bringToFront);
   */
  eiti.util.bringToFront = function() {
    this._nextSibling = this.nextSibling;
    this.parentNode.appendChild(this);
  };

  /**
   * The compliment to {@link bringToFront}, returns an
   * element to its previous position among its siblings.
   * @name eiti.util.sendToBack
   *
   * @example
   * d3.selectAll('svg path')
   *   .on('mouseover', eiti.util.bringToFront)
   *   .on('mouseout', eiti.util.sendToBack);
   */
  eiti.util.sendToBack = function() {
    this.parentNode.insertBefore(this, this._nextSibling);
    delete this._nextSibling;
  };

  // TODO: document
  eiti.util.classify = classify;


  eiti.format = {};

  /**
   * Create a composite format that wraps a d3 format (or any other
   * formatting function) with a transform function.
   * @name eiti.format.transform
   * @param {String|Function} format
   * @param {Function} transform
   * @return {Function}
   */
  eiti.format.transform = function(format, transform) {
    if (typeof format === 'string') {
      format = d3.format(format);
    }
    return function(d) {
      return transform(format(d) || '');
    };
  };

  /**
   * Create a range formatter that strips the preceding `$`
   * from the second value to produce strings like `$10m - 20m`
   * instead of `$10m - $20m`.
   * @name eiti.format.range
   * @param {String|Function} format
   * @param {String} [glue]
   * @return {Function}
   */
  eiti.format.range = function(format, glue) {
    if (typeof format === 'string') {
      format = d3.format(format);
    }
    if (!glue) glue = ' – ';
    return function(range) {
      range = range.map(function(d, i) {
        var str = format(d);
        return i > 0 ? str.replace('$', '') : str;
      });
      /*
      // suffix de-duping
      var suffix = range.map(function(str) {
        var match = str.match(/[a-z]$/);
        return match ? match[0] : null;
      });
      if (suffix[0] === suffix[1]) {
        range[0] = range[0].substr(0, range[0].length - 1);
      }
      */
      return range.join(glue);
    };
  };

  /**
   * This is a format transform that turns metric SI suffixes into more
   * US-friendly ones: M -> m, G -> b, etc.
   * @param {String} str the formatted string
   * @return {String} the formatted string with replaced SI suffix
   */
  eiti.format.transformMetric = (function() {
    var suffix = {k: 'k', M: 'm', G: 'b'};
    return function(str) {
      return str.replace(/[kMG]$/, function(s) {
        return suffix[s] || s;
      });
    };
  })();

  /**
   * Produces international system/metric form, e.g. `4.1M`
   * @name eiti.format.metric
   * @function
   * @param {Number} num
   * @return {String}
   */
  eiti.format.metric = eiti.format.transform('.2s', eiti.format.transformMetric);

  /**
   * Produces whole dollar strings with thousands separators, e.g.
   * `$1,234,567`.
   * @name eiti.format.dollars
   * @function
   * @param {Number} num
   * @return {String}
   */
  eiti.format.dollars = d3.format('$,.0f');

  /**
   * Produces dollar strings with thousands separators and 2-decimal
   * cents, e.g. `$1,234,567.89`.
   * @name eiti.format.dollarsAndCents
   * @function
   * @param {Number} num
   * @return {String}
   */
  eiti.format.dollarsAndCents = d3.format('$,.2f');

  /**
   * Produces short dollar strings in SI format with 1 decimal,
   * e.g. `$1.2m` or `$4.8b`.
   * @name eiti.format.shortDollars
   * @function
   * @param {Number} num
   * @return {String}
   */
  eiti.format.shortDollars = eiti.format.transform('$,.2s', eiti.format.transformMetric);

  function getter(key) {
    if (typeof key === 'function') return key;
    return function(d) { return d[key]; };
  }

  /*
   * This is a d3 helper that allows you to toggle multiple classes
   * *when used with `d3.selection#classed`*. You do *not* need this
   * otherwise.
   */
  function classify(_add, _remove) {
    var add = [];
    var remove = [];

    var classify = function() {
      var classes = this.classList;
      if (add && add.length) {
        add.forEach(function(klass) {
          classes.add(klass);
        });
      }
      if (remove && remove.length) {
        remove.forEach(function(klass) {
          classes.remove(klass);
        });
      }
      return this.className;
    }

    classify.add = function(_) {
      if (!arguments.length) return add;
      add = Array.isArray(_) ? _ : [_];
      return classify;
    };

    classify.remove = function(_) {
      if (!arguments.length) return remove;
      remove = Array.isArray(_) ? _ : [_];
      return classify;
    };

    return classify
      .add(_add)
      .remove(_remove);
  }

})(this);
