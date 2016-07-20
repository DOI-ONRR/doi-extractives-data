(function(exports) {
  'use strict';

  require('./../components/aria-toggle.js');
  require('./../components/eiti-data-map.js');
  require('./../components/bar-chart-table.js');
  require('./../components/eiti-bar-chart.js');
  require('./../components/year-switcher-section.js');

  require('./../components/aria-tabs.js');
  require('./../components/sticky-nav.js');

  var OpenListNav = require('./../components/open-list-nav.js');

  // exporting instance of OpenListNav because openListNav is
  // referenced in the markup:
  // _includes/hash_selecor.html
  exports.openListNav = new OpenListNav();

})(window);

