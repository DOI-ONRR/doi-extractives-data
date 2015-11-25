(function(exports) {

  var symbols = {
    collapsed: '__collapsedText',
    expanded: '__expandedText'
  };

  var innerMarkup = {
    bars: '<span class="u-visually-hidden"><icon class="fa fa-bars"></icon></span>',
    x: '<span class="u-visually-hidden"><icon class="icon-close-x"></icon></span>'
  }

  var EXPANDED = 'aria-expanded';
  var CONTROLS = 'aria-controls';
  var HIDDEN = 'aria-hidden';

  exports.EITIToggle = document.registerElement('eiti-toggle', {
    'extends': 'button',
    prototype: Object.create(HTMLButtonElement.prototype, {

      createdCallback: {
        value: function() {
          var elem = document.querySelector('#demo');
          console.log(elem)
          var clone = document.importNode(elem.content, true);
          this.createShadowRoot().appendChild(clone);
        }
      },
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

      collapsedText: {
        get: function() {
          return this[symbols.collapsed]
            || this.getAttribute('data-collapsed-text')
            || this.textContent;
        },
        set: function(text) {
          this[symbols.collapsed] = text;
          update.call(this);
        }
      },

      expandedText: {
        get: function() {
          console.log('expandedText')
          return this[symbols.expanded]
            || this.getAttribute('data-expanded-text')
            || this.textContent;
        },
        set: function(text) {
          this[symbols.expanded] = text;
          update.call(this);
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

          console.log(this)
          this.setAttribute(EXPANDED, expanded);
        }
      }
    })
  });

  function toggle() {
    this.expanded = !this.expanded;
  }

  function update() {
    this.textContent = this.expanded
      ? this.expandedText
      : this.collapsedText;

    var attrInnerMarkup = this.getAttribute('data-inner-markup');
    this.innerHTML = innerMarkup[attrInnerMarkup];

    var id = this.getAttribute(CONTROLS);

    // console.log(id, 'update', this.innerMarkup)
    var target = document.getElementById(id);
    // console.log(target)
    if (target) {
      target.setAttribute(HIDDEN, !this.expanded);
    }
  }

})(this);
