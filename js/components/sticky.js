(function(exports) {
  'use strict';

  var sticky = require('stickyfill')();

  [].forEach.call(
    document.querySelectorAll('.sticky'),
    function(el) {
      sticky.add(el);
      el.parentNode.insertBefore(document.createElement('div'), el)
        .setAttribute('class', 'pre-sticky');
    }
  );

  exports.stickyfill = sticky;

})(window);
