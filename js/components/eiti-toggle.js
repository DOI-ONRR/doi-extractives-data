(function(exports) {

  var textCollapsed = '__collapsedText';
  var textExpanded = '__expandedText';
  var EXPANDED = 'aria-expanded';

  exports.EITIToggle = document.registerElement('eiti-toggle', {
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

      collapsedText: {
        get: function() {
          return this[textCollapsed]
            || this.getAttribute('data-collapsed-text')
            || this.textContent;
        },
        set: function(text) {
          this[textCollapsed] = text;
          update.call(this);
        }
      },

      expandedText: {
        get: function() {
          return this[textExpanded]
            || this.getAttribute('data-expanded-text');
        },
        set: function(text) {
          this[textExpanded] = text;
          update.call(this);
        }
      },

      expanded: {
        get: function() {
          return this.getAttribute(EXPANDED) === 'true';
        },
        set: function(expanded) {
          switch (expanded) {
            case 'true':
              expanded = true;
              break;
            case 'false':
              expanded = false;
              break;
          }
          this.setAttribute(EXPANDED, !!expanded);
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

    var id = this.getAttribute(CONTROLS);
    var target = document.getElementById(id);
    if (target) {
      target.setAttribute(HIDDEN, !this.expanded);
    }
  }

})(this);
