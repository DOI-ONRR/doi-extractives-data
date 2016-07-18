(function(exports) {

  var attached = function() {
    var root = d3.select(this);

    var select = root.selectAll('select.chart-selector');
    var charts = root.selectAll('eiti-bar-chart');
    var maps = root.selectAll('eiti-data-map');

    var mapTables = root.selectAll('.eiti-data-map-table');

    var chartTables = mapTables.selectAll('table[is="bar-chart-table"]')
    console.log(maps)
    console.log('=============')
    console.log(chartTables)

    var update = function(year) {
      charts.property('x', year);
      maps.each(function() {
        this.setYear(year);
      });
      select.property('value', year);
      chartTables.each(function(){
        console.log(this)
        this.setYear(year);
        this.update();
      })
    };

    select.on('change.year', function() {
      update(this.value);
    });

    charts.selectAll('g.bar')
      .on('click.year', function(d) {
        update(d.x);
      });
  };

  var detached = function() {
  };

  exports.EITIYearSwitcherSection = document.registerElement('year-switcher-section', {
    'extends': 'section',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        detachdCallback: {value: detached}
      }
    )
  })

})(this);
