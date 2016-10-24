(function() {

  var attached = function() {
    var root = d3.select(this);

    var select = root.selectAll('select.chart-selector');
    var charts = root.selectAll('eiti-bar-chart');
    var nonIconCharts = charts.filter(function () {
      return !this.hasAttribute('is-icon');
    })
    var maps = root.selectAll('eiti-data-map');

    var mapTables = root.selectAll('.eiti-data-map-table');
    var mapTableComponents = root.selectAll('figure[is="eiti-data-map-table"]');

    var chartTables = mapTables.selectAll('table[is="bar-chart-table"]');

    var yearValues = root.selectAll('year-value');

    var update = function(year, updateAllCharts) {
      root.selectAll('.eiti-bar-chart-x-value')
        .text(year);

      // if (updateAllCharts) {
      charts.property('x', year);
      // } else {
        // nonIconCharts.property('x', year);
      // }

      maps.each(function() {
        this.setYear(year);
      });
      select.property('value', year);
      chartTables.each(function() {
        this.setYear(year);
        this.update();
      });

      mapTableComponents.each(function() {
        this.clearAllFields();
      });

      yearValues.attr('year', year);
    };

    select.on('change.year', function() {
      update(this.value, true);
    });


    nonIconCharts.selectAll('g.bar')
      .on('click.year', function(d) {
        update(d.x);
      });
  };

  var detached = function() {
  };

  document.registerElement('year-switcher-section', {
    'extends': 'section',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        detachedCallback: {value: detached}
      }
    )
  });

})();
