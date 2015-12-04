(function() {
  'use strict';

  var root = d3.select('#companies');
  var filterToggle = root.select('button.toggle-filters');
  var revenueTypeList = root.select('#revenue-types');
  var companyList = root.select('#companies');

  var getter = eiti.data.getter;
  var grouper;
  var formatNumber = eiti.format.dollars;
  var REVENUE_TYPE_PREFIX = /^[A-Z]+(\/[A-Z]+)?\s+-\s+/;

  var state = eiti.explore.stateManager()
    .on('change', update);

  var hash = eiti.explore.hash()
    .on('change', state.merge);

  var model = eiti.explore.model(eiti.data.path + 'company/revenue.tsv')
    .transform(removeRevenueTypePrefix)
    .filter('commodity', function(data, commodity) {
      return data.filter(function(d) {
        return d.Commodity === commodity;
      });
    })
    .filter('type', function(data, type) {
      return data.filter(function(d) {
        return d.revenueType === type;
      });
    })
    .on('prefilter', function(key, data) {
      if (key === 'commodity') {
        updateCommoditySelector(data);
        updateRevenueTypeSelector(data);
      }
    });

  var filters = root.selectAll('.filters [name]')
    .on('change', filterChange);

  var search = root.select('#company-name-filter')
    .on('keyup', updateNameSearch)
    .on('clear', filterChange)
    .on('change', filterChange);

  var initialState = hash.read();
  if (Object.keys(initialState).length) {
    filterToggle.attr('aria-expanded', true);
  }

  state.init(initialState);

  function update(state) {
    var query = state.toJS();
    hash.write(query);

    updateFilterDescription(state);

    grouper = d3.nest()
      .rollup(function(d) {
        return d3.sum(d, getter('Revenue'));
      })
      .sortValues(function(a, b) {
        return d3.descending(+a.Revenue, +b.Revenue);
      });

    var hasCommodity = !!query.commodity;
    var hasType = !!query.type;
    if (hasType && !hasCommodity) {
      grouper.key(getter('Commodity'));
    } else {
      grouper.key(getter('revenueType'));
    }

    model.load(state, function(error, data) {
      if (error) {
        console.error('error:', error);
        data = [];
      }

      filters.each(function() {
        this.value = state.get(this.name) || '';
      });

      search.property('value', state.get('search') || '');

      render(data, state);
    });
  }

  function render(data /*, state */) {
    // console.log('rendering %d rows', data.length, data[0]);
    updateRevenueTypes(data);
    updateCompanyList(data);
  }

  function updateCommoditySelector(data) {
    var commodities = d3.nest()
      .key(getter('Commodity'))
      .entries(data)
      .map(getter('key'))
      .sort(d3.ascending);
    var input = root.select('#commodity-selector');
    var options = input.selectAll('option.value')
      .data(commodities, identity);
    options.enter().append('option')
      .attr('class', 'value')
      .attr('value', identity)
      .text(identity);
  }

  function updateRevenueTypeSelector(data) {
    var commodities = d3.nest()
      .key(getter('revenueType'))
      .entries(data)
      .map(getter('key'))
      .sort(d3.ascending);
    var input = root.select('#type-selector');
    var options = input.selectAll('option.value')
      .data(commodities, identity);
    options.enter().append('option')
      .attr('class', 'value')
      .attr('value', identity)
      .text(identity);
  }

  function updateRevenueTypes(data) {
    var types = grouper.entries(data)
      .map(function(d) {
        return {
          name: d.key,
          value: d.values
        };
      });

    var max = d3.max(types, getter('value'));
    revenueTypeList.call(renderSubtypes, types, max);
  }

  function updateCompanyList(data) {
    var companies = d3.nest()
      .key(getter('Company'))
      .entries(data)
      .map(function(d) {
        var total = d3.sum(d.values, getter('Revenue'));
        return {
          name: d.key,
          total: total,
          types: grouper.entries(d.values)
            .map(function(d) {
              return {
                name: d.key,
                value: d.values
              };
            })
            /*
            .concat([{
              name: 'Total',
              value: total
            }])
            */
        };
      });

    var items = companyList.selectAll('tbody.company')
      .data(companies, getter('name'));

    items.exit().remove();

    var enter = items.enter().append('tbody')
      .attr('class', 'company subgroup');
    enter.append('tr')
      .attr('class', 'name')
      .append('th')
        .attr('colspan', 3)
        .attr('class', 'subregion-name')
        .text(getter('name'));

    items.sort(function(a, b) {
      return d3.descending(a.total, b.total);
    });

    var max = d3.max(companies, getter('total'));
    items.call(renderSubtypes, getter('types'), max);
  }

  function renderSubtypes(selection, types, max) {
    var items = selection.selectAll('.subtype')
      .data(types, getter('name'));

    items.exit().remove();
    items.enter().append('tr')
      .attr('class', 'subtype')
      .call(setupRevenueItem);

    items
      .call(updateRevenueItem, max)
      .sort(function(a, b) {
        return d3.descending(a.value, b.value);
      });
  }

  function updateNameSearch() {
    var query = search.property('value').toLowerCase();
    companyList.selectAll('.company')
      .style('display', query
        ? function(d) {
            return d.name.toLowerCase().indexOf(query) > -1
              ? null
              : 'none';
          }
        : null);
  }

  function setupRevenueItem(selection) {
    selection.append('td')
      .attr('class', 'name');
    selection.append('td')
      .attr('class', 'value');
    selection.append('td')
      .attr('class', 'bar')
      .append('eiti-bar');
  }

  function updateRevenueItem(selection, max) {
    selection.select('.name')
      .text(getter('name'));

    selection.select('.value')
      .text(function(d) {
        return formatNumber(d.value);
      });

    var bar = selection.select('eiti-bar')
      .attr('value', getter('value'));
    if (max) {
      bar.attr('max', max);
    }
  }

  function updateFilterDescription(state) {
    var desc = root.select('#filter-description');

    var data = {
      type: state.get('type') || 'All revenue',
      commodity: (state.get('commodity') || 'all resource').toLowerCase(),
    };

    /*
    if (data.commodity === 'N/A') {
      data.commodity = 'no applicable';
    }
    */

    desc.selectAll('[data-key]')
      .text(function() {
        return data[this.getAttribute('data-key')];
      });
  }

  function removeRevenueTypePrefix(row) {
    if (!row.revenueType) {
      row.revenueType = row['Revenue Type'].replace(REVENUE_TYPE_PREFIX, '');
    }
  }

  function filterChange() {
    state.set(this.name, this.value);
  }

  function identity(d) {
    return d;
  }

})(this);
