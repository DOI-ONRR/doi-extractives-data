(function(exports) {

  var renderId = '__render_id';
  var EPSILON = .5;

  var attributeChanged = function(attr, prev, value) {
    switch (attr) {
      case 'value':
      case 'min':
      case 'max':
      case 'negative':
        this[attr] = value;
        break;
    }
  };

  exports.EITIBar = document.registerElement('eiti-bar', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        createdCallback: {value: function() {
          this.__bar = getBar(this);
        }},

        attachedCallback: {value: function() {
          [].forEach.call(this.attributes, function(attr) {
            attributeChanged.call(this, attr.name, null, attr.value);
          });
        }},

        attributeChangedCallback: {value: attributeChanged},

        negative: genericProperty(
          'negative',
          false,
          parseBoolean,
          render
        ),

        min: numericProperty('min', 0),
        max: numericProperty('max', 1),
        value: numericProperty('value', 0)
      }
    )
  });

  function getBar(parent) {
    var klass = 'eiti-bar-bar';
    var bar = parent.getElementsByClassName(klass)[0];
    if (!bar) {
      bar = parent.appendChild(document.createElement('span'));
      bar.setAttribute('class', klass);
    }
    return bar;
  }

  function render() {
    if (this[renderId]) {
      cancelAnimationFrame(this[renderId]);
    }
    this[renderId] = requestAnimationFrame(_render.bind(this));
  }

  function _render() {
    var min = this.min;
    var max = this.max;
    var value = this.value;
    var negative = this.negative;

    var bar = getBar(this);
    bar.classList.toggle('eiti-bar-bar_negative', negative);

    var width = scale(value, min, max) * 100;
    if (width > 0) {
      bar.style.setProperty('width', (width < EPSILON
                            ? EPSILON
                            : Math.round(width)) + '%');
    } else {
      bar.style.setProperty('width', '0%');
    }
    delete this[renderId];
  }

  function scale(value, min, max) {
    return Math.min(1, Math.max((value - min) / (max - min), 0));
  }

  function genericProperty(name, value, parse, change) {
    var symbol = '__' + name;
    if (!parse) {
      parse = identity;
    }
    return {
      get: function() {
        return (symbol in this) ? this[symbol] : value;
      },
      set: function(value) {
        if (parse) {
          value = parse.call(this, value, name);
        }
        if (value !== this[symbol]) {
          this[symbol] = value;
          if (change) {
            change.call(this, value, name);
          }
        }
      }
    };
  }

  function numericProperty(name, value, parse, change) {
    return genericProperty(name, value, parseNumber, render);
  }

  function parseNumber(n) {
    return isNaN(n) ? 0 : Number(n);
  }

  function parseBoolean(value) {
    return (typeof value === 'string')
      ? value === 'true'
      : !!value;
  }

  function identity(d) {
    return d;
  }

})(this);
