(function(exports) {

  exports.CustomElement = registerElement('custom-element', {
    createdCallback: function() {
    },

    attachedCallback: function() {
      this.addEventListener('click', getListener('click', this));
    },

    detachedCallback: function() {
      this.removeEventListener('click', getListener('click', this));
    },

    attributeChangedCallback: function(attr, prev, value) {
    },

    value: accessor('value', null, null, function(value) {
      this.dispatchEvent(new CustomEvent('change', {value: value}));
    })
  });

  var events = {
    click: function(e) {
      this.value = Math.random();
      e.preventDefault();
      return false;
    }
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

})(this);
