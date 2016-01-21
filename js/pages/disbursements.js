// globals d3, eiti, EITIBar
(function() {
  // 'use strict';

  var root = d3.select('#disbursements');

  var getter = eiti.data.getter;
  var formatNumber = eiti.format.dollarsAndCents;

  var state = eiti.explore.stateManager()
    .on('change', update);

  var hash = eiti.explore.hash()
    .on('change', state.merge);

  var model = eiti.explore.model(eiti.data.path + 'disbursements/funds.tsv')
    .transform(function(d) {
      d.Total = +d.Total;
    })
    .filter('year', function(data, year) {
      return data.filter(function(d) {
        return d.Year === year;
      });
    })
    .filter('fund', function(data, fund) {
      return data.filter(function(d) {
        return d.Fund === fund;
      });
    })
    .filter('state', function(data, state) {
      return data.filter(function(d) {
        return d.State === state;
      });
    });

  var initialState = hash.read();

  var filters = root.selectAll('.filters [name]');

  filters.each(function() {
    if (!initialState.has(this.name)) {
      initialState = initialState.set(this.name, this.value);
    }
  });

  state.init(initialState);

  function update(state) {
    console.log('update:', state.toJS());
    model.load(state, function(error, data) {
      render(data, state);
    });
  }

  function render(data, state) {
    console.log('render:', data);
  }

})(this);
