(function() {
  'use strict';

  var root = d3.select('#companies');
  var filterToggle = root.select('button.toggle-filters');
  var revenueTypeList = root.select('#revenue-types');
  var companyList = root.select('#companies');

  var getter = eiti.data.getter;
  var formatNumber = eiti.format.dollars;
  var REVENUE_TYPE_PREFIX = /^[A-Z]+(\/[A-Z]+)?\s+-\s+/;

  var groupByRevenueType = d3.nest()
    .key(getter('revenueType'))
    .rollup(function(d) {
      return d3.sum(d, getter('Revenue'));
    })
    .sortValues(function(a, b) {
      return d3.descending(+a.Revenue, +b.Revenue);
    });

  var state = eiti.explore.stateManager()
    .on('change', update);

  var hash = eiti.explore.hash()
    .on('change', state.merge);

  var model = eiti.explore.model(function(state) {
      return eiti.data.path + 'company/revenue.tsv';
    })
    .transform(function(d) {
      removeRevenueTypePrefix(d);
    })
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
      } else if (key === 'type') {
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

  function render(data, state) {
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

  function updateCommodities(data) {
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

  function updateRevenueTypes(data) {
    var types = groupByRevenueType.entries(data)
      .map(function(d) {
        return {
          label: d.key,
          value: d.values
        };
      });

    var items = revenueTypeList.selectAll('.revenue-type')
      .data(types, getter('label'));

    items.exit().remove();
    items.enter().append('tr')
      .attr('class', 'revenue-type')
      .call(setupRevenueItem);

    var max = d3.max(types, getter('value'));
    items
      .call(updateRevenueItem, max)
      .sort(function(a, b) {
        return d3.descending(a.value, b.value);
      });
  }

  function updateCompanyList(data) {
    var companies = d3.nest()
      .key(getter('Company'))
      .entries(data)
      .map(function(d) {
        return {
          name: d.key,
          total: d3.sum(d.values, getter('Revenue')),
          types: groupByRevenueType.entries(d.values)
            .map(function(d) {
              return {
                label: d.key,
                value: d.values
              };
            })
        };
      });

    var rows = companyList.selectAll('tr.company')
      .data(companies, getter('name'));

    rows.exit().remove();
    var enter = rows.enter().append('tr')
      .attr('class', 'company')
      .call(setupCompanyRow);

    enter.select('.name').text(getter('name'));

    var max = d3.max(companies, getter('total'));
    rows
      .call(updateCompanyRow, max)
      .sort(function(a, b) {
        return d3.descending(a.total, b.total);
      });

    updateNameSearch();
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

  function setupCompanyRow(selection) {
    selection.append('td')
      .attr('class', 'name');
    var valueCell = selection.append('td')
      .attr('class', 'revenue');

    /*
    var total = valueCell.append('div')
      .attr('class', 'revenue-total')
      .call(setupCompanyRevenueItem);
    total.select('.label')
      .text(' total');
    */

    valueCell.append('div')
      .attr('class', 'revenue-types');
  }

  function updateCompanyRow(selection, max) {
    /*
    var total = selection.select('.revenue-total');
    total.select('eiti-bar')
      .attr('max', max)
      .attr('value', getter('total'));
    total.select('span.value')
      .text(function(d) {
        return formatNumber(d.total);
      });
    */

    var types = selection.select('.revenue-types')
      .selectAll('.revenue-type')
      .data(getter('types'), getter('label'));

    types.exit().remove();
    types.enter().append('div')
      .call(setupCompanyRevenueItem);

    types
      .call(updateCompanyRevenueItem, max)
      .sort(function(a, b) {
        return d3.descending(a.value, b.value);
      });
  }

  function setupCompanyRevenueItem(selection) {
    selection.append('eiti-bar');
    selection.append('span')
      .attr('class', 'value');
    selection.append('span')
      .attr('class', 'label');
  }

  function updateCompanyRevenueItem(selection) {
    selection.select('eiti-bar')
      .attr('max', max)
      .attr('value', getter('value'));

    selection.select('span.value')
      .text(function(d) {
        return formatNumber(d.value);
      });

    /*
    selection.select('.label')
      .text(getter('label'));
    */
  }

  function setupRevenueItem(selection) {
    selection.append('td')
      .attr('class', 'label');
    selection.append('td')
      .attr('class', 'value');
    selection.append('td')
      .attr('class', 'bar')
      .append('eiti-bar');
  }

  function updateRevenueItem(selection, max) {
    selection.select('.label')
      .text(getter('label'));

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
