(function(exports) {

  var EXPANDED = 'aria-expanded';
  var HIDDEN = 'aria-hidden';
  var CONTROLS = 'aria-controls';

  var toggle = function(button) {
    var expanded = button.getAttribute(EXPANDED) !== 'true';
    var target = document.getElementById(button.getAttribute(CONTROLS));
    button.setAttribute(EXPANDED, expanded);
    target.setAttribute(HIDDEN, !expanded);
  };

  var click = function(event) {
    toggle(event.target);
  };

  exports.ARIAToggle = document.registerElement('aria-toggle', {
    'extends': 'button',
    prototype: Object.create(
      HTMLButtonElement.prototype,
      {
        attachedCallback: {value: function() {
          this.addEventListener('click', click);
        }},

        detachedCallback: {value: function() {
          this.removeEventListener('click', click);
        }}
      }
    )
  });

})(this);
