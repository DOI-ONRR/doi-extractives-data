(function(exports) {
  'use strict';

  var sticky = require('stickyfill-web-module')();
  var stickies = [];
  var doc = d3.select(document);
  var win = d3.select(window);

  [].forEach.call(
    document.querySelectorAll('.sticky'),
    function(el) {
      stickies.push(el);
      sticky.add(el);
      if (!el.classList.contains('mobile-nav')) {
        var isNav = el.classList.contains('sticky_nav');
        var preSticky = document.createElement('div');
        el.parentNode.insertBefore(preSticky, el)
          .setAttribute('class', 'pre-sticky');

        if (isNav) {
          preSticky.classList.add('pre-sticky-small');
        }
      }
    }
  );

  var watch = function() {
    stickies.forEach(function(sticky) {

      var isFixed = d3.select(sticky).style('position') === 'fixed';
      var atTop = (sticky.lastTop !== sticky.offsetTop) || isFixed;
      var isStuck = sticky.classList.contains('stuck');

      sticky.lastTop = sticky.offsetTop;
      if (atTop && !isStuck) {
        sticky.classList.add('stuck');
      } else if (!atTop && isStuck) {
        sticky.classList.remove('stuck');
      }
    });
  };

  var throttledWatch = eiti.util.throttle(watch, 100);
  doc.on('scroll.sticky', watch);
  win.on('resize.sticky', throttledWatch);

  watch();

  exports.stickyfill = sticky;

})(window);
