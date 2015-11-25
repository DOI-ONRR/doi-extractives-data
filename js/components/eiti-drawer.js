(function(exports) {


  var EXPANDED = 'aria-expanded';
  var CONTROLS = 'aria-controls';
  var HIDDEN = 'aria-hidden';


  exports.EITIDrawerTrigger = document.registerElement('eiti-drawer-trigger', {
    'extends': 'button',
    prototype: Object.create(HTMLButtonElement.prototype, {

      attachedCallback: {value: function() {
        this.addEventListener('click', toggle);
        update.call(this);
      }},

      detachedCallback: {value: function() {
        this.removeEventListener('click', toggle);
      }},

      attributeChangedCallback: {value: function(attr, prev, value) {
        switch (attr) {
          case EXPANDED:
            update.call(this);
            break;
        }
      }},

      controlAttribute: {
        get: function() {
          return this[attrControl] || HIDDEN;
        },
        set: function(attr) {
          this[attrControl] = attr;
        }
      },

      expanded: {
        get: function() {
          return this.getAttribute(EXPANDED) === 'true';
        },
        set: function(expanded) {
          // coerce strings to booleans
          if (expanded === 'true') {
            expanded = true;
          } else if (expanded === 'false') {
            expanded = false;
          } else {
            expanded = !!expanded;
          }
          this.setAttribute(EXPANDED, expanded);
        }
      }
    })
  });

  function toggle() {
    this.expanded = !this.expanded;
  }

  function update() {

    var id = this.getAttribute(CONTROLS);
    var target = document.getElementById(id);
    if (target) {
      target.setAttribute(HIDDEN, !this.expanded);
    }
  }

})(this);
