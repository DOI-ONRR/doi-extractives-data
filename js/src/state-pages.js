(function(exports) {
  'use strict';

  require('./../components/bar-chart-table.js');
  require('./../components/data-map.js');

  require('./../components/aria-tabs.js');
  require('./../components/sticky-nav.js');
  exports.OpenListNav = require('./../components/open-list-nav.js');

  // exporting instance of OpenListNav because openListNav is
  // referenced in the markup:
  // _includes/hash_selecor.html
  exports.openListNav = new OpenListNav();

})(window);

