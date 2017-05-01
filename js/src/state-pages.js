(function(exports) {
  'use strict';

  require('../components/aria-toggle.js');
  require('../components/eiti-data-map.js');
  require('../components/bar-chart-table.js');
  require('../components/eiti-bar-chart.js');
  require('../components/year-value.js');
  require('../components/year-switcher-section.js');
  require('../components/eiti-data-map-table.js');
  require('../components/eiti-tooltip-wrapper.js');
  require('../components/ownership-map.js');

  require('../components/aria-tabs.js');

  require('../components/sticky.js');
  require('../components/mobile-nav.js');
  require('../components/filter.js');
  require('../components/filter-section.js');

  // exporting instance of OpenListNav because openListNav is
  // referenced in the markup:
  // _includes/hash_selector.html
  var OpenListNav = require('../components/open-list-nav.js');
  exports.openListNav = new OpenListNav();

  require('../blocks/state-pages-events.js');
})(window);

