(function(exports) {
  'use strict';

  var sticky = require('stickyfill')();
  var allStickies = [];

  [].forEach.call(
    document.querySelectorAll('.sticky'),
    function(el) {
      allStickies.push(el);
      sticky.add(el);
      var isNav = el.classList.contains('sticky_nav');
      var preSticky = document.createElement('div');
      el.parentNode.insertBefore(preSticky, el)
        .setAttribute('class', 'pre-sticky');

      if (isNav) {
        preSticky.classList.add('pre-sticky-small');
      }
    }
  );

  var watch = function() {
    allStickies.forEach(function(sticky, i) {
      var atTop = Number(sticky.getBoundingClientRect().top) === 0;
      var isStuck = sticky.classList.contains('stuck');

      if (atTop && !isStuck) {
        sticky.classList.add('stuck');
      } else if (!atTop && isStuck) {
        sticky.classList.remove('stuck');
      }
    });
  }

  window.addEventListener('scroll', eiti.util.throttle(watch, 100));
  window.addEventListener('resize', eiti.util.throttle(watch, 100));

  exports.stickyfill = sticky;

})(window);
