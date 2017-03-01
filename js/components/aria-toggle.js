(function(exports) {

  var EXPANDED = 'aria-expanded';
  var HIDDEN = 'aria-hidden';
  var CONTROLS = 'aria-controls';

  var toggle = function(button, expanded) {
    if (typeof expanded !== 'boolean') {
      expanded = button.getAttribute(EXPANDED) !== 'true';
    }
    var target = document.getElementById(button.getAttribute(CONTROLS));
    button.setAttribute(EXPANDED, expanded);
    var attr = button.getAttribute('aria-toggles') || HIDDEN;
    target.setAttribute(
      attr,
      (attr === HIDDEN) ? !expanded : expanded
    );
    return expanded;
  };

  var collapse = function(button) {
    return toggle(button, false);
  }

  var expand = function(button) {
    return toggle(button, true);
  }

  var click = function(event) {
    toggle(this);
    event.preventDefault();
  };

  exports.ARIAToggle = document.registerElement('aria-toggle', {
    'extends': 'button',
    prototype: Object.create(
      HTMLButtonElement.prototype,
      {
        createdCallback: {value: function() {
          this.setAttribute('type', 'button');
        }},

        attachedCallback: {value: function() {
          if (this.hasAttribute(EXPANDED)) {
            toggle(this, this.getAttribute(EXPANDED) === 'true');
          }
          this.addEventListener('click', click);
        }},

        toggle: {value: function(expanded) {
          return toggle(this, expanded);
        }},

        expand: {value: function() {
          return expand(this);
        }},

        collapse: {value: function() {
          return collapse(this);
        }},

        detachedCallback: {value: function() {
          this.removeEventListener('click', click);
        }},

        attributeChangedCallback: {value: function(attr, old, value) {
          switch (attr) {
            case EXPANDED:
              return toggle(this, value === 'true');
          }
        }}
      }
    )
  });

})(this);
