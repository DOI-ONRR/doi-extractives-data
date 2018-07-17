(function() {

  var assign = require('object-assign');
  var d3 = require('d3');
  var identity = function(d) {
    return d;
  };

  var attributeReflector = function(attr, options) {
    var read = options.read || identity;
    var write = options.write || identity;
    var defaultValue = d3.functor(options.defaultValue);
    var change = options.update;
    return {
      get: function() {
        return this.hasAttribute(attr)
          ? read.call(this, this.getAttribute(attr), attr)
          : defaultValue.call(this, attr);
      },
      set: function(value) {
        if (value !== this[attr]) {
          this.setAttribute(attr, write.call(this, value, attr));
          if (typeof change === 'function') {
            change.call(this);
          }
        }
      }
    };
  };

  var update = function() {
    var year = this.year;
    if (isNaN(year)) {
      return;
    }
    var values = JSON.parse(
      this.getAttribute('data-year-values') || '{}'
    );
    var value = values[this.year];
    var format = this.format;
    if (value === null || value === undefined) {
      this.textContent = this.empty;
    } else {
      this.textContent = format
        ? d3.format(format)(value)
        : String(value);
    }
  };

  document.registerElement('year-value', {
    observedAttributes: ['year', 'format', 'empty'],
    prototype: assign(
      Object.create(
        HTMLElement.prototype,
        // descriptors go here
        {
          year: attributeReflector('year', {
            read: Number,
            write: String,
            change: update
          }),

          format: attributeReflector('format', {
          }),

          empty: attributeReflector('empty', {
            defaultValue: ''
          })
        }
      ),
      // methods go here
      {
        update: update,
        attachedCallback: function() {
          update.call(this);
        },
        attributeChangedCallback: function() {
          update.call(this);
        }
      }
    )
  });

})();
