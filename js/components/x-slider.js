(function(exports) {

  exports.XSlider = registerElement('x-slider', {
    createdCallback: function() {
      console.log('x-slider created');
      this.setAttribute('unresolved', '');
      this.min = getAttr.call(this, 'min', 0);
      this.max = getAttr.call(this, 'max', 100);
      this.value = getAttr.call(this, 'value', 0);
      this.snap = this.hasAttribute('snap');
    },

    attachedCallback: function() {
      console.log('x-slider attached');

      var load = (function() {
        console.warn('load!');

        this.removeAttribute('unresolved');
        this.__handle = this.querySelector('.handle') || createHandle.call(this);
        this.update();

        this.addEventListener('click', events.click);
        this.addEventListener('mousedown', events.engage);
        this.addEventListener('touchstart', events.engage);
        this.addEventListener('focus', events.focus, true);
        window.removeEventListener('load', load);
      }).bind(this);

      window.addEventListener('load', load);
    },

    detachedCallback: function() {
      // console.log('x-slider detached');
      this.removeEventListener('click', events.click);
      this.removeEventListener('mousedown', events.enagage);
      this.removeEventListener('touchstart', events.enagage);
      this.removeEventListener('focus', events.focus, true);
    },

    attributeChangedCallback: function(attr, prev, value) {
      switch (attr) {
        case 'min':
        case 'max':
        case 'value':
        case 'snap':
          // console.log('x-slider attr: ', attr, ' = ', value);
          this[attr] = value;
          this.update();
          break;
      }
    },

    update: function() {
      if (this.hasAttribute('unresolved')) return;

      var min = this.min;
      var max = this.max;
      var value = this.value;

      var x = function(value) {
        return 100 * (value - min) / (max - min);
      };

      var handle = this.__handle;
      var left = x(value);
      // console.log('left: ', value, ' -> ', left);
      handle.style.setProperty('left', left.toFixed(2) + '%');

      var text = handle.querySelector('.value');
      if (text) {
        text.textContent = String(value);
        var textWidth = text.getBoundingClientRect().width;
        var marginLeft = (-textWidth / 2);
        text.style.setProperty('margin-left', marginLeft + 'px');
      }

      try {
        var event = new CustomEvent('change', {
          value: value
        });
        this.dispatchEvent(event);
      } catch (err) {
        console.warn('unable to fire "change": ', err);
      }
    },

    // clamp to min and max, round if snap === true
    value: property('value', function(v) {
      v = clamp(+v, this.min, this.max);
      if (this.snap) v = Math.round(v);
      return v;
    }),

    // parse min and max as numbers
    min: property('min', Number),
    max: property('max', Number),

    // parse snap as a boolean
    snap: property('snap', Boolean)
  });

  // so that event listeners
  var events = {
    click: function(e) {
      // ignore right-clicks
      if (e.button === 2) return false;

      var rect = this.getBoundingClientRect();
      var width = rect.width;
      var x = e.clientX - rect.left;
      // console.log('click: ', e.clientX, ', ', rect.left, ' -> ', x);
      var value = this.min + (x / width) * (this.max - this.min);
      if (this.snap) value = Math.round(value);
      // console.log('value: ', value);
      this.value = value;
      this.update();
    },

    engage: function(e) {
      // ignore right-clicks
      if (e.button === 2) {
        e.preventDefault();
        return false;
      }

      this.__dragging = true;
      this.classList.add('__dragging');

      window.addEventListener('mousemove', getListener('move', this));
      window.addEventListener('touchmove', getListener('move', this));
      window.addEventListener('mouseup', getListener('release', this));
      window.addEventListener('touchend', getListener('release', this));
    },

    move: function(e) {
      events.click.call(this, e);
      e.preventDefault();
      return false;
    },

    release: function(e) {
      this.__dragging = false;
      this.classList.remove('__dragging');
      window.removeEventListener('mousemove', getListener('move', this));
      window.removeEventListener('touchmove', getListener('move', this));
      window.removeEventListener('mouseup', getListener('release', this));
      window.removeEventListener('touchend', getListener('release', this));
      e.preventDefault();
      return false;
    },

    keypress: function(e) {
      // console.log('keypress:', e);
      switch (e.keyCode) {
        case 37: // left
          this.value--;
          break;
        case 39: // right
          this.value++;
          break;
      }
    },

    focus: function(e) {
      window.addEventListener('keyup', getListener('keypress', this));
      this.addEventListener('blur', events.blur);
    },

    blur: function(e) {
      window.removeEventListener('keyup', getListener('keypress', this));
      this.removeEventListener('blur', events.blur);
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

  function getAttr(name, fallback) {
    return this.hasAttribute(name)
      ? this.getAttribute(name)
      : fallback;
  }

  function property(name, parse) {
    var key = '__' + name;
    return {
      get: function() {
        return this[key];
      },
      set: function(value) {
        if (parse) value = parse.call(this, value, name);
        if (value !== this[key]) {
          this[key] = value;
          this.update();
        }
      }
    };
  }

  function createHandle() {
    var div = document.createElement('div');
    div.className = 'handle';
    return this.appendChild(div);
  }

  function clamp(x, min, max) {
    if (x < min) return min;
    else if (x > max) return max;
    return x;
  }
})(this);
