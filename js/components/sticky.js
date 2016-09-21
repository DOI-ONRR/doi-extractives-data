(function(exports) {
  'use strict';

  var sticky = require('stickyfill')();

  [].forEach.call(
    document.querySelectorAll('.sticky'),
    function(el) {
      sticky.add(el);
      var isNav = el.classList.contains('sticky_nav');
      var preSticky = el.parentNode.insertBefore(document.createElement('div'), el)
        .setAttribute('class', 'pre-sticky')

      if (isNav) {
        preSticky.classList.add('pre-sticky-small');
      }

    }
  );

  exports.stickyfill = sticky;

})(window);
