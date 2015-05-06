(function(exports) {

  exports.XSlider = registerElement('x-slider', {
    createdCallback: function() {
      // console.log('x-slider created');
      this.min = getAttr.call(this, 'min', 0);
      this.max = getAttr.call(this, 'max', 100);
      this.value = getAttr.call(this, 'value', 0);
      this.snap = this.hasAttribute('snap');
    },

    attachedCallback: function() {
      // console.log('x-slider attached');
      this.__attached = true;
      this.__handle = this.querySelector('.handle') || createHandle.call(this);
      this.update();

      this.addEventListener('click', this.__onclick);
      this.addEventListener('mousedown', this.__mousedown);
    },

    detachedCallback: function() {
      // console.log('x-slider detached');
      this.removeEventListener('click', this.__onclick);
    },

    attributeChangedCallback: function(attr, prev, value) {
      switch (attr) {
        case 'min':
        case 'max':
        case 'value':
        case 'snap':
          console.log('x-slider attr: ', attr, ' = ', value);
          this[attr] = value;
          this.update();
          break;
      }
    },

    update: function() {
      if (!this.__attached) return;
      // console.log('x-slider update');

      var min = +this.min;
      var max = +this.max;
      var value = clamp(+this.value, min, max);
      if (this.snap) value = Math.round(value);
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

    __ondrag: function(e) {
      this.__onclick(e);
    },

    __mousedown: function(e) {
      this.__dragging = true;
      this.classList.add('__dragging');

      var move = (function(e) {
        this.__onclick(e);
        e.preventDefault();
        return false;
      }).bind(this);

      var up = (function(e) {
        this.__dragging = false;
        this.classList.remove('__dragging');
        window.removeEventListener('mousemove', move);
        window.removeEventListener('touchmove', move);
        window.removeEventListener('mouseup', up);
        window.removeEventListener('touchend', up);
        e.preventDefault();
        return false;
      }).bind(this);

      window.addEventListener('mousemove', move);
      window.addEventListener('touchmove', move);
      window.addEventListener('mouseup', up);
      window.addEventListener('touchend', up);
    },

    __onclick: function(e) {
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

    value: property('value', Number),
    min: property('min', Number),
    max: property('max', Number),
    snap: property('snap', Boolean)

  });

  function registerElement(name, proto, parent) {
    if (!parent) parent = HTMLElement;
    for (var key in proto) {
      if (typeof proto[key] === 'function') {
        proto[key] = {value: proto[key]};
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
        if (parse) value = parse(value);
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
