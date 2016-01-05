(function(exports) {
  'use strict';

  var d3 = require('d3');
  var queue = require('queue-async');

  /*
   * @namespace eiti
   */
  var eiti = exports;

  /**
   * Load a URL by inferring its data type based on the extension (.csv, .tsv,
   * or .json) and cache responses for repeated calls.
   *
   * @param String      url       the URL to load
   * @param Function    callback  the error-first (`(error, data)`) callback
   *                              function
   * @param {Boolean?}  fresh     if truthy, don't load this file from the cache
   *
   * @return Object     a d3.xhr response (or -like) object with an
   *                    `abort()` method.
   */
  eiti.load = (function() {
    var cache = d3.map();

    var loading = d3.map();

    var loaders = {};
    ['csv', 'tsv', 'json'].forEach(function(type) {
      loaders[type] = d3[type];
    });

    var load = function(url, done, fresh) {
      var req;
      if (loading.has(url)) {
        req = loading.get(url);
        req.callbacks.push(done);
        return req;
      }

      var ext = url.split('.').pop().split('?').shift();
      var loader = loaders[ext];
      var cached = cache.get(url);
      if (cached && !fresh) {
        requestAnimationFrame(function() {
          // console.log('[defer] load cached:', url);
          done(null, cached);
        });
        return;
      }

      req = loader.call(d3, url, function(error, data) {
        // console.log('loaded:', url);
        loading.remove(url);
        if (!error) {
          cache.set(url, data);
        }
        process(req.callbacks, error, data);
      });

      // override the abort() method to remove this
      // request from the loading map
      var abort = req.abort;
      req.abort = function() {
        // console.info('[eiti.load] aborted:', url);
        loading.remove(url);
        abort();
      };

      req.callbacks = [done];
      loading.set(url, req);
      return req;
    };

    var process = function(callbacks, error, data) {
      if (callbacks.length === 1) {
        return callbacks[0](error, data);
      }
      var next = function() {
        var cb = callbacks.shift();
        cb(error, data);
        if (callbacks.length) {
          window.requestAnimationFrame(next);
        }
      };
      return next();
    };

    load.clearCache = function() {
      var keys = cache.keys();
      keys.forEach(cache.remove);
      return keys;
    };

    return load;
  })();

  eiti.loadAll = function(sources, done) {
    var q = queue();
    var result = {};
    Object.keys(sources).forEach(function(key) {
      q.defer(function(next) {
        eiti.load(sources[key], function(error, data) {
          if (error) {
            return next(error);
          }
          next(null, result[key] = data);
        });
      });
    });
    return q.await(function(error) {
      return done(error, result);
    });
  };

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
    if (rollup) {
      nest.rollup(rollup);
    }
    return nest.map(rows);
  };

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

  // TODO: remove
  eiti.ui.expando = function(selection) {
    selection.datum(function(d) {
      var text = this.textContent;
      return d || {
        'true': this.getAttribute('data-expanded-text') || text,
        'false': this.getAttribute('data-collapsed-text') || text
      };
    })
    .on('click.expando', eiti.ui.expando.toggle);
  };

  // TODO: remove
  eiti.ui.expando.toggle = function toggle(d) {
    var id = this.getAttribute('aria-controls');
    var hidden = 'aria-hidden';
    var target = d3.select('#' + id);
    var expanded = target.attr(hidden) !== 'false';
    target.attr(hidden, !expanded);
    if (d) {
      this.textContent = d[expanded];
    }
    this.setAttribute('aria-expanded', expanded);
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
      for (var key in o) { /* jshint -W089 */
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


  /**
   * Coerce a d3-style format string or function into a number
   * format function.
   */
  eiti.format = function(format) {
    return (typeof format === 'function')
      ? format
      : d3.format(format);
  };

  /**
   * Create a composite format that wraps a d3 format (or any other
   * formatting function) with a transform function.
   *
   * @name eiti.format.transform
   * @function
   *
   * @param {String|Function} format
   * @param {Function} transform
   * @return {Function}
   */
  eiti.format.transform = function(format, transform) {
    format = eiti.format(format);
    return function(d) {
      return transform(format(d) || '');
    };
  };

  eiti.format.percent = eiti.format('.1%');

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
    format = eiti.format(format);
    if (!glue) {
      glue = ' – ';
    }
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
   * This is a format transform that turns metric/SI suffixes into more
   * US-friendly ones: M -> m, G -> b, etc.
   *
   * @param {String} str the formatted string
   * @return {String} the formatted string with replaced SI suffix
   */
  eiti.format.transformMetric = (function() {
    var suffix = {k: 'k', M: 'm', G: 'b'};
    return function(str) {
      return str.replace(/(\.0+)?([kMG])$/, function(_, zeroes, s) {
        return suffix[s] || s;
      })
      .replace(/\.0+$/, '');
    };
  })();

  /**
   * Produces international system ("SI")/metric form.
   *
   * @example
   * assert.equal(eiti.format.is(4.2e6), '4.2m');
   *
   * @name eiti.format.si
   * @function
   *
   * @param {Number} num
   * @return {String}
   */
  eiti.format.si = eiti.format.transform('.2s', eiti.format.transformMetric);

  eiti.format.transformDollars = function(str) {
    if (str.charAt(0) === '-') {
      str = '(' + str.substr(1) + ')';
    }
    return '$' + str;
  };

  /**
   * Produces whole dollar strings in SI/metric form, prefixed
   * with a '$', and negative numbers in parentheses.
   *
   * @name eiti.format.dollars
   * @function
   *
   * @param {Number} num
   * @return {String}
   */
  eiti.format.dollars = eiti.format.transform(
    eiti.format.si,
    eiti.format.transformDollars
  );

  /**
   * Produces dollar strings with thousands separators and 2-decimal
   * cents, e.g. `$1,234,567.89`.
   *
   * @name eiti.format.dollarsAndCents
   * @function
   *
   * @param {Number} num
   * @return {String}
   */
  eiti.format.dollarsAndCents = eiti.format.transform(
    ',.2f',
    eiti.format.transformDollars
  );

  /**
   * Produces short dollar strings in SI format with 1 decimal,
   * e.g. `$1.2m` or `$4.8b`.
   * @name eiti.format.shortDollars
   * @function
   * @param {Number} num
   * @return {String}
   */
  eiti.format.shortDollars = eiti.format.transform(
    '$,.2s', eiti.format.transformMetric
  );

  eiti.format.pluralize = function(num, singular, plural) {
    return (num === 1)
      ? singular
      : plural || singular + 's';
  };

  function getter(key) {
    if (typeof key === 'function') {
      return key;
    }
    return function(d) {
      return d[key];
    };
  }

  /*
   * This is a d3 helper that allows you to toggle multiple classes
   * *when used with `d3.selection#classed`*. You do *not* need this
   * otherwise.
   */
  function classify(_add, _remove) {
    var add = [];
    var remove = [];

    var classify = function() { // jshint ignore:line
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
    };

    classify.add = function(_) {
      if (!arguments.length) {
        return add;
      }
      add = Array.isArray(_) ? _ : [_];
      return classify;
    };

    classify.remove = function(_) {
      if (!arguments.length) {
        return remove;
      }
      remove = Array.isArray(_) ? _ : [_];
      return classify;
    };

    return classify
      .add(_add)
      .remove(_remove);
  }


  /**
   * URL mutation
   */

  eiti.url = {};

  eiti.url.merge = function(href, data) {
    return eiti.url.qs.merge(href, data);
  };

  eiti.url.qs = (function() {

    var qs = function(data) {
      return typeof data === 'string' ? qs.parse(data) : data || {};
    };

    // strings that are typically okay to include in the hash
    qs.replacements = {
      '%20': '+',
      '%2C': ','
    };

    qs.encode = function(val) {
      var replace = qs.replacements;
      return encodeURIComponent(val)
        .replace(/(\%[A-F0-9]{2})/g, function(_, hex) {
          return hex in replace
            ? replace[hex]
            : hex;
        });
    };

    qs.decode = function(str) {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    };

    // querystring.parse('?foo=a&baz=1') -> {foo: 'a', baz: 1}
    qs.parse = function(str, separator) {
      if (str.charAt(0) === '?') {
        str = str.substr(1);
      }

      var query = {};
      forEach(str.split(separator || '&'), function(bit) {
        var parts = bit.split('=', 2),
            key = qs.decode(parts[0]),
            value = parts.length > 1
              ? qs.decode(parts[1])
              : true;
        switch (value) {
          case 'true':
            value = true;
            break;
          case 'false':
            value = false;
            break;
          case '':
            break;
          default:
            var num = +value;
            if (!isNaN(num)) {
              value = num;
            }
        }
        query[key] = value;
      });

      return query;
    };

    // querystring.format({foo: 'a', baz: 1}) -> '?foo=a&baz=1'
    qs.format = function(obj, separator, sortKeys) {
      var entries = [];
      for (var key in obj) { /* jshint -W089 */
        var value = obj[key];
        if (obj.hasOwnProperty(key) &&
            (typeof value !== 'undefined') && value !== '') {
          entries.push({key: key, value: String(obj[key])});
        }
      }
      if (sortKeys) {
        entries.sort(function(a, b) {
          return a.key > b.key ? 1 : a.key < b.key ? -1 : 0;
        });
      }
      return entries.length
        ? entries.map(function(e) {
            return [qs.encode(e.key), qs.encode(e.value)].join('=');
          }).join(separator || '&')
        : '';
    };

    qs.merge = function(url, data) {
      var bits = url.split('?');
      var query;
      // if there's a query string...
      if (bits.length > 1) {
        query = qs.parse(bits[1]);
        if (typeof data === 'string') {
          data = qs.parse(data);
        }
        for (var key in data) { /* jshint -W089 */
          query[key] = data[key];
        }
        query = qs.format(query);
      } else {
        query = (typeof data === 'string')
          ? data
          : qs.format(data);
      }
      return query ? [bits[0], query].join('?') : bits[0];
    };

    return qs;
  })();

  function forEach(list, fn, context) {
    return Array.prototype.forEach.call(list, fn, context);
  }


  /**
   * CustomEvent polyfill via:
   * <https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent>
   */
  (function () {
    try {
      var e = new CustomEvent('foo'); // jshint ignore:line
    } catch (error) {
      function CustomEvent(event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles,
                            params.cancelable, params.detail);
        return evt;
      }
      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
    }
  })();


  /**
   * DOMTokenList::toggle() fix
   *
   * This addresses a bug in IE10+ in which DOMTokenList::toggle()
   * doesn't respect the second argument, but just flips the class.
   */
  (function() {
    var el = document.createElement('div');
    el.classList.toggle('foo', false);
    if (el.className === 'foo') {
      DOMTokenList.prototype.toggle = function(klass, active) {
        return this[active ? 'add' : 'remove'](klass);
      };
    }
  })();

})(module.exports);
