(function(exports) {

  var stickyfill = require('stickyfill')();

  [].forEach.call(
    document.querySelector('.sticky'),
    stickyfill.add
  );

  exports.stickyfill = stickyfill;

})(window);
