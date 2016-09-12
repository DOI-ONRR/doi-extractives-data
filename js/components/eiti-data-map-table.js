(function() {
  'use strict';

  var attached = function() {
    var root = d3.select(this);

    var maps = root.selectAll('eiti-data-map');
    var mapToggles = maps.selectAll('button[is="aria-toggle"]');
    var mapTables = root.selectAll('.eiti-data-map-table');
    var counties = maps.selectAll('.county.feature')

    var chartTables = mapTables.selectAll('table[is="bar-chart-table"]')

    var chartRows = chartTables.selectAll('tr[data-fips]')

    var highlightCounty = function(fips, event) {
      event = event || 'selected';
      counties.classed('mouseover', false);
      counties.classed(event, false);

      counties.each(function(d) { // eslint-disable-line no-unused-vars
        var county = d3.select(this);
        if (+county.attr('data-fips') === +fips) {
          county.classed(event, true);
        }
      });
    };

    var toggleTable = function(d) { // eslint-disable-line no-unused-vars
      var countyFIPS = this.getAttribute('data-fips');

      highlightCounty(countyFIPS);

      mapToggles.each(function() {
        this.expand();
      });

      chartTables.each(function() {
        this.show(countyFIPS);
      })
    };

    var toggleMap = function() {
      var fips = this.getAttribute('data-fips');

      highlightCounty(fips);

      chartTables.each(function() {
        this.show(fips);
      });
    };

    var mouseoverMap = function() {
      var fips = this.getAttribute('data-fips');
      highlightCounty(fips, 'mouseover');
    };

    var mouseleaveMap = function() {
      var fips = this.getAttribute('data-fips');
      highlightCounty(fips, 'mouseleave');
    };

    chartRows.on('click.countyTable', toggleMap);
    chartRows.on('mouseover.countyTable', mouseoverMap);
    chartRows.on('mouseleave.countyTable', mouseleaveMap);

    counties.on('click.county', toggleTable);
  };

  var detached = function() {
  };

  document.registerElement('eiti-data-map-table', {
    'extends': 'figure',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        detachdCallback: {value: detached}
      }
    )
  })

})(this);
