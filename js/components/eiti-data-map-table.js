(function(exports) {

  var attached = function() {
    var root = d3.select(this);
    var self = d3.select(this);

    var moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    var moveToBack = function() {
      return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
        }
      });
    };


    var select = root.selectAll('select.chart-selector');
    var maps = root.selectAll('eiti-data-map');
    var svg = root.select('svg');
    var mapToggles = maps.selectAll('button[is="aria-toggle"]');
    var mapTables = root.selectAll('.eiti-data-map-table');
    var counties = maps.selectAll('.county.feature');
    var countiesUse = maps.selectAll('.county.feature use');


    var chartTables = this.chartTables = mapTables.selectAll('table[is="bar-chart-table"]')
    var chartRows = chartTables.selectAll('tr[data-fips]')

    var highlightCounty = this.highlightCounty = function(fips, event) {
      event = event || 'selected';
      counties.classed('mouseover', false);
      counties.classed(event, false);
      var unselectedCounties = counties.filter(function(){
        return !d3.select(this).classed('selected');
      });
      unselectedCounties.call(moveToBack);

      if (fips) {
        counties.each(function(){
          var county = d3.select(this);
          var numbers = typeof(county.attr('data-fips')) === 'number' ||
            typeof(fips) === 'number';
          var areEqual = numbers
            ? +county.attr('data-fips') === +fips
            : county.attr('data-fips') === fips;

          if (areEqual) {
            county.classed(event, true);
            county.call(moveToFront);
          }
        });
      }
    };

    var toggleTable = function(context) {
      context = context || this;
      var parent = context.parentNode;

      var hasValue = parent.getAttribute('data-value') &&
        parent.getAttribute('data-value') !== 'null';

      if (hasValue) {
        var countyFIPS = parent.getAttribute('data-fips');

        highlightCounty(countyFIPS, 'selected');

        mapToggles.each(function(){
          this.expand();
        });

        chartTables.each(function(){
          this.show(countyFIPS, 'selected');
        });
      }
    };

    var mouseTable = function(context, event) {
      context = context || this;

      var parent = context.parentNode;
      var hasValue = parent.getAttribute('data-value') &&
        parent.getAttribute('data-value') !== 'null';
      if (hasValue) {
        var countyFIPS = parent.getAttribute('data-fips');

        highlightCounty(countyFIPS, event);

        chartTables.each(function(){
          this.highlight(countyFIPS, event);
        });
      }
    };

    var toggleMap = function() {
      var fips = this.getAttribute('data-fips');
      highlightCounty(fips, 'selected');

      chartTables.each(function(){
        this.show(fips, 'selected');
      });
    };

    var mouseMap = function () {
      event = event.type;
      var fips = this.getAttribute('data-fips');

      highlightCounty(fips, event);

      chartTables.each(function(){
        this.highlight(fips, event);
      });
    };

    var clearFields = function() {
      highlightCounty(null, 'mouseout');

      chartTables.each(function(){
        this.highlight(null, 'mouseout');
      });
    };

    chartRows.on('click.countyTable', toggleMap);
    chartRows.on('mouseover.countyTable', mouseMap);
    chartRows.on('mouseout.countyTable', mouseMap);


    countiesUse
      .on('click.county', function(){
        toggleTable(this);
      })
      .on('mouseover.county', function(){
        var that = this;
        setTimeout(function(){
          eiti.util.throttle(mouseTable(that, 'mouseover'), 200);
        }, 10);
      });

    svg.on('mouseout.county', function(){
      clearFields();
    });
  };

  var detached = function() {
  };

  var clearAllFields = function() {
    this.highlightCounty(null);

    this.chartTables.each(function(){
      this.hide();
    });
  };

  exports.EITIDataMapTable = document.registerElement('eiti-data-map-table', {
    'extends': 'figure',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        detachdCallback: {value: detached},
        clearAllFields: {value: clearAllFields}
      }
    )
  })

})(this);

