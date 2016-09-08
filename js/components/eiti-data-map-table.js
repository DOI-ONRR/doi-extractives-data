(function(exports) {

  var attached = function() {
    var root = d3.select(this);
    var self = d3.select(this);

    var select = root.selectAll('select.chart-selector');
    var maps = root.selectAll('eiti-data-map');
    var mapToggles = maps.selectAll('button[is="aria-toggle"]');
    var mapTables = root.selectAll('.eiti-data-map-table');
    var counties = maps.selectAll('.county.feature')

    var chartTables = mapTables.selectAll('table[is="bar-chart-table"]')

    var chartRows = chartTables.selectAll('tr[data-fips]')

    var toggleTable = function(d, i) {

      var countyName = this.querySelector('title').textContent;
      var countyFIPS = this.getAttribute('data-fips');

      highlightCounty(countyFIPS);

      mapToggles.each(function(){
        this.expand();
      });

      chartTables.each(function(){
        this.show(countyFIPS);
      })
    };

    var highlightCounty = function(fips, event) {
      event = event || 'selected';
      counties.classed('mouseover', false);
      counties.classed(event, false);

      counties.each(function(d, i){
        var county = d3.select(this);
        if (+county.attr('data-fips') === +fips) {
          county.classed(event, true);
        }
      });
    }

    var toggleMap = function() {
      var fips = this.getAttribute('data-fips');

      highlightCounty(fips);

      chartTables.each(function(){
        this.show(fips);
      });
    }

    var mouseoverMap = function () {
      var fips = this.getAttribute('data-fips');

      highlightCounty(fips, 'mouseover');
    }

    chartRows.on('click.countyTable', toggleMap);
    chartRows.on('mouseover.countyTable', mouseoverMap);
    counties.on('click.county', toggleTable);
  };

  var detached = function() {
  };

  exports.EITIDataMapTable = document.registerElement('eiti-data-map-table', {
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

