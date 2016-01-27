(function(eiti) {
  'use strict';

  eiti.explore = {};

  /**
   * @class stateManager
   * The state manager helps you manage application state, using an
   * Immutable.Map under the hood.
   *
   * @example
   * var manager = eiti.explore.stateManager()
   *   .on('change', function(state) {
   *   })
   *   .set('foo', 'bar');
   */
  eiti.explore.stateManager = function() {

    var state = new Immutable.Map();
    var updated = false;
    var mutating = false;

    var manager = {};
    var dispatch = d3.dispatch('change');

    // the default state validator is a noop
    var validateState = function(state /*, previous, updated */) {
      return state;
    };

    /**
     * Raw state mutation with a function, which should take an
     * Immutable.Map and return either the same one or a mutated
     * instance:
     *
     * @example
     * manager.mutate(function(state) {
     *   return state.set('x', 1);
     * });
     *
     * @param Function mutator
     */
    manager.mutate = function(fn) {
      mutateState(fn);
      return manager;
    };

    /**
     * set a single key
     * @param String key
     * @param {*} value
     */
    manager.set = function(key, value) {
      mutateState(function(state) {
        return state.set(key, value);
      });
      return manager;
    };

    /**
     * merge the keys of the provided object
     * @param Object keys
     */
    manager.merge = function(keys) {
      mergeState(keys);
      return manager;
    };

    /**
     * Provide a validation function for your state before 'change'
     * events are updated. This should return an Immutable.Map, e.g.
     *
     * @example
     * manager.validate(function(state) {
     *   if (!state.has('foo')) {
     *     return state.set('foo', 'default foo');
     *   }
     *   return state;
     * });
     *
     * @param Function validator
     */
    manager.validate = function(validator) {
      validateState = validator;
      return manager;
    };

    /**
     * Initialize the manager state with an optional Object literal.
     *
     * @param {Object}? initial
     */
    manager.init = function(initial) {
      var previous = state;
      if (initial) {
        mergeState(initial) || update(state, previous); // jshint ignore:line
      } else {
        update(state, null);
      }
      return manager;
    };

    function update(state, previous) {
      dispatch.change(state, previous, updated);
      updated = true;
    }

    // mutate the state and update if the state has changed
    function mutateState(fn) {
      mutating = true;
      var previous = state;
      state = fn(state) || new Immutable.Map();
      if (!Immutable.is(state, previous)) {
        state = validateState(state, previous, updated);
        update(state, previous);
        mutating = false;
        return true;
      }
      mutating = false;
      return false;
    }

    function mergeState(keys) {
      return mutateState(function(state) {
        return state.merge(keys);
      });
    }

    return d3.rebind(manager, dispatch, 'on');
  };

  eiti.explore.hash = function() {
    var dispatch = d3.dispatch('change');

    var hash = {};
    var writing = false;

    hash.read = function() {
      if (!location.hash) {
        return {};
      }
      var str = location.hash.substr(1);
      return eiti.url.qs.parse(str);
    };

    hash.write = function(data) {
      writing = true;
      location.hash = data ? eiti.url.qs.format(data) : '';
      writing = false;
    };

    function change(e) { // jshint ignore:line
      if (writing) {
        return;
      }
      dispatch.change(hash.read());
    }

    window.addEventListener('hashchange', change);

    return d3.rebind(hash, dispatch, 'on');
  };

  eiti.explore.model = function(url) {
    var model = {};
    var dispatch = d3.dispatch('prefilter', 'postfilter');
    var getDataURL = d3.functor(url);
    var transform;
    var req;

    var filters = [];

    model.load = function(state, done) {
      if (req) {
        req.abort();
      }
      var url = getDataURL(state);
      // console.log('model.load():', url);
      req = eiti.load(url, function(error, data) {
        if (error) {
          data = [];
        }
        if (transform) {
          data.forEach(transform);
        }
        applyFilters(data, state, done);
      });
      return req;
    };

    model.filter = function(stateKey, filter) {
      filters.push({
        key: stateKey,
        func: filter
      });
      return model;
    };

    model.transform = function(fn) {
      if (arguments.length) {
        transform = fn;
        return model;
      }
      return transform;
    };

    function applyFilters(data, state, done) {
      filters.forEach(function(filter) {
        var value = state.get(filter.key);
        dispatch.prefilter(filter.key, data);
        if (value || value === 0) { // XXX
          data = filter.func(data, value, filter.key);
          dispatch.postfilter(filter.key, data);
        }
      });

      done(null, data);
    }

    return d3.rebind(model, dispatch, 'on');
  };


  eiti.explore.timeline = function() {
    var getter = eiti.data.getter;
    var value = getter('value');
    var aggregate;

    var years = [];
    var selected;

    var timeline = function(selection, data) {
      var rollup = aggregate || function(d) {
        return d3.sum(d, value);
      };

      var dataByYearPolarity = d3.nest()
        .key(function(d) {
          return value(d) < 0 ? 'negative' : 'positive';
        })
        .key(getter('Year'))
        .rollup(rollup)
        .map(data);

      // console.log('data by year/polarity:', dataByYearPolarity);
      var positiveYears = dataByYearPolarity.positive || {};
      var positiveExtent = d3.extent(d3.values(positiveYears));
      var negativeYears = dataByYearPolarity.negative || {};
      var negativeExtent = d3.extent(d3.values(negativeYears));

      var w = 500;
      var h = 40;
      var viewBox = selection.attr('viewBox');
      // if there is a viewBox already, derive the dimensions from it
      if (viewBox) {
        viewBox = viewBox.split(' ').map(Number);
        w = viewBox[2];
        h = viewBox[3];
      } else {
        // otherwise, set up the viewBox with our default dimensions
        selection.attr('viewBox', [0, 0, w, h].join(' '));
      }

      var left = 0; // XXX need to make room for axis labels
      var right = w;

      // the x-axis scale
      var x = d3.scale.linear()
        .domain(d3.extent(years))
        .range([left, right + 2]);

      // the y-axis domain sets a specific point for zero.
      // the `|| -100` and `|| 100` bits here ensure that the domain has some
      // size, even if there is no data from which to derive an extent.
      var yDomain = [
        negativeExtent[0] || 0,
        positiveExtent[1] || 100
      ];
      // the y-axis scale, with the zero point at 3/4 the height
      // XXX: note that this exaggerates the negative scale!
      var y = d3.scale.linear()
        .domain(yDomain)
        .range([h, 0]);

      var area = d3.svg.area()
        .interpolate('step-after')
        .x(function(d) { return x(d.year); })
        .y0(y(0))
        .y1(function(d) { return y(d.value); });

      var areas = selection.selectAll('path.area')
        .data([
          {
            polarity: 'positive',
            values: years.map(function(year) {
              return {
                year: year,
                value: positiveYears[year] || 0
              };
            })
          },
          {
            polarity: 'negative',
            values: years.map(function(year) {
              return {
                year: year,
                value: negativeYears[year] || 0
              };
            })
          }
        ]);

      areas.exit().remove();
      areas.enter().append('path')
        .attr('class', function(d) {
          return 'area ' + d.polarity;
        });

      var zero = selection.select('g.zero');
      if (zero.empty()) {
        zero = selection.append('g')
          .attr('class', 'zero');
        zero.append('line');
        zero.append('text')
          .attr('class', 'label')
          .attr('text-anchor', 'end')
          .attr('dy', 0.5);
          // .text(0);
      }

      var mask = selection.select('g.mask');
      if (mask.empty()) {
        mask = selection.append('g')
          .attr('class', 'mask');
        mask.append('rect')
          .attr('class', 'before')
          .attr('x', 0)
          .attr('width', 0)
          .attr('height', h);
        mask.append('rect')
          .attr('class', 'after')
          .attr('x', w)
          .attr('width', w)
          .attr('height', h);
        mask.append('line')
          .attr('class', 'before')
          .attr('y1', 0)
          .attr('y2', h);
        mask.append('line')
          .attr('class', 'after')
          .attr('y1', 0)
          .attr('y2', h);
      }

      var updated = selection.property('updated');
      var t = function(d) { return d; };
      if (updated) {
        t = function(d) {
          return d.transition()
            .duration(500);
        };
      }

      var year1 = selected || years[years.length - 1];
      var year2 = year1 + 1;

      var beforeX = x(year1);
      var afterX = Math.min(x(year2), w);
      // don't transition these
      mask.select('rect.before')
        .attr('width', beforeX);
      mask.select('rect.after')
        .attr('x', afterX);
      mask.select('line.before')
        .attr('transform', 'translate(' + [beforeX, 0] + ')');
      mask.select('line.after')
        .attr('transform', 'translate(' + [afterX, 0] + ')');

      // transition these
      // mask = t(mask);
      mask.selectAll('line')
        .attr('y1', y(positiveYears[year1] || 0))
        .attr('y2', y(negativeYears[year1] || 0));

      zero.select('line')
        .attr('x1', left)
        .attr('x2', right);

      zero.select('.label')
        .attr('transform', 'translate(' + [left, 0] + ')');

      t(zero).attr('transform', 'translate(' + [0, y(0)] + ')');

      t(areas).attr('d', function(d) {
        return area(d.values);
      });
      selection.property('updated', true);
    };

    timeline.selected = function(year) {
      if (arguments.length) {
        selected = year;
        return timeline;
      }
      return selected;
    };

    timeline.years = function(list) {
      if (arguments.length) {
        years = list;
        return timeline;
      }
      return years;
    };

    timeline.value = function(fn) {
      if (arguments.length) {
        value = fn || identity;
        return timeline;
      }
      return value;
    };

    timeline.aggregate = function(fn) {
      if (arguments.length) {
        aggregate = fn;
        return timeline;
      }
      return aggregate;
    };

    return timeline;
  };

  function identity(d) {
    return d;
  }

})(eiti);
