(function(eiti) {

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
        mergeState(initial) || update(state, previous);
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

    // the default state validator is a noop
    function validateState(state, previous, updated) {
      return state;
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

    function change(e) {
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

})(eiti);
