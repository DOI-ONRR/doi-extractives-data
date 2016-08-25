(function(exports) {

  var Stickyfill = require('stickyfill');
  var stickyfill = Stickyfill();

  var stickyElements = document.getElementsByClassName('sticky');

  for (var i = stickyElements.length - 1; i >= 0; i--) {
      stickyfill.add(stickyElements[i]);
  }
  exports.Stickyfill = Stickyfill;
  exports.stickyfill = stickyfill;


})(this);
