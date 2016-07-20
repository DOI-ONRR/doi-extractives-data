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
    target.setAttribute(HIDDEN, !expanded);
    return expanded;
  };

  var collapse = function(button) {
    var target = document.getElementById(button.getAttribute(CONTROLS));
    button.setAttribute(EXPANDED, false);
    target.setAttribute(HIDDEN, true);
  }

  var expand = function(button) {
    var target = document.getElementById(button.getAttribute(CONTROLS));
    button.setAttribute(EXPANDED, true);
    target.setAttribute(HIDDEN, false);
  }

  var click = function(event) {
    toggle(this);
  };

  exports.ARIAToggle = document.registerElement('aria-toggle', {
    'extends': 'button',
    prototype: Object.create(
      HTMLButtonElement.prototype,
      {
        attachedCallback: {value: function() {
          if (this.hasAttribute(EXPANDED)) {
            toggle(this, this.getAttribute(EXPANDED) === 'true');
          }
          this.addEventListener('click', click);
        }},

        toggle: {value: function(expanded) {
          return toggle(this, expanded);
        }},

        detachedCallback: {value: function() {
          this.removeEventListener('click', click);
        }},

        attributeChangedCallback: {value: function(attr, old, value) {
          switch (attr) {
            case 'aria-expanded':
              if (value === 'false') {
                collapse(this);
              } else if (value === 'true') {
                expand(this);
              }
          }
        }}
      }
    )
  });

})(this);
