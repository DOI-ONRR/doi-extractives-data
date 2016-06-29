(function(exports) {
  'use strict';

  require('./../components/sticky-nav.js');
  var OpenListNav = require('./../components/open-list-nav.js');

  // exporting instance of OpenListNav because openListNav is
  // referenced in the markup:
  // _includes/hash_selecor.html
  exports.openListNav = new OpenListNav();

})(window);
