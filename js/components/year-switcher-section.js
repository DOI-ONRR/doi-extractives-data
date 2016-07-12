(function(exports) {

  var attached = function() {
    var select = this.querySelector('select');
    var charts = d3.select(this).selectAll('eiti-bar-chart');
    var maps = d3.select(this).selectAll('data-map');


    var update = function(year) {
      charts.property('x', year);
      maps.each(function() {
        this.setYear(year);
      });
      select.value = year;
    };

    select.addEventListener('change', function() {
      update(this.value);
    });

    charts.selectAll('g.bar')
      .on('click', function(d) {
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
