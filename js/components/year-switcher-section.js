(function(exports) {

  var attached = function() {
    var select = this.querySelector('select');
    var charts = d3.select(this).selectAll('eiti-bar-chart');

    var update = function(year) {
      charts.property('x', year);
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
