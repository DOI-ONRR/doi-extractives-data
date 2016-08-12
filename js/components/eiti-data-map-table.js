(function(exports) {

  var attached = function() {
    var root = d3.select(this);

    var select = root.selectAll('select.chart-selector');
    var maps = root.selectAll('eiti-data-map');
    var mapToggle = maps.selectAll('button[is="aria-toggle"]');
    var counties = maps.selectAll('.county.feature');
    var mapTables = root.selectAll('.eiti-data-map-table');

    var chartTables = mapTables.selectAll('table[is="bar-chart-table"]')

    // var update = function(year) {
    //   charts.property('x', year);
    //   maps.each(function() {
    //     this.setYear(year);
    //   });
    //   select.property('value', year);
    //   chartTables.each(function(){
    //     this.setYear(year);
    //     this.update();
    //   })
    // };

    counties.on('click.county', function() {
      console.log(this)
      // update('county')
    });

    // charts.selectAll('g.bar')
    //   .on('click.year', function(d) {
    //     update(d.x);
    //   });
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
