(function() {

  var attached = function() {
    var root = d3.select(this);

    var select = root.selectAll('select.chart-selector');
    var charts = root.selectAll('eiti-bar-chart');
    var maps = root.selectAll('eiti-data-map');

    var mapTables = root.selectAll('.eiti-data-map-table');
    var mapTableComponents = root.selectAll('figure[is="eiti-data-map-table"]');

    var chartTables = mapTables.selectAll('table[is="bar-chart-table"]');

    var yearValues = root.selectAll('year-value');

    var update = function(year, icon) {
      root.selectAll('.eiti-bar-chart-x-value')
        .text(year);

      var filteredCharts = charts.filter(function() {
        var chart = d3.select(this);
        var isDisabled = chart.attr('updates-disabled');
        var isIcon = chart.attr('is-icon');
        return !isDisabled;
      })
      filteredCharts.property('x', year);
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
      // var self = this;
      // charts.each(function() {
      //   console.log('change year:', !d3.select(this).attr('updates-disabled'))
      //   var isDisabled = d3.select(this).attr('updates-disabled')
      //   // if (!isDisabled) {
      //     console.log('update this:', self)
      //     update(self.value);
      //   }
      // });
      update(this.value);
      // console.log('change year', charts.attr('updates-disabled'))
      // if (!charts.attr('updates-disabled')) {
      //   console.log('update', charts.attr('updates-disabled'))

      // }
    });

    charts.selectAll('g.bar')
      .on('click.year', function(d) {
        charts.each(function() {
          var chart = d3.select(this);
          var isDisabled = chart.attr('updates-disabled');
          var isIcon = chart.attr('is-icon');
          if (!isIcon && !isDisabled) {
            update(d.x);
          }
        });
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
