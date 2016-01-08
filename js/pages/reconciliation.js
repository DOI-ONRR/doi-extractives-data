// globals d3, eiti, EITIBar
(function() {
  // 'use strict';

  var root = d3.select('#reconciliation');
  var filterToggle = root.select('button.toggle-filters');
  var revenueTypeList = root.select('#revenue-types');
  var companyList = root.select('#companies');

  var getter = eiti.data.getter;
  var grouper;
  var formatNumber = eiti.format.dollarsAndCents;
  var REVENUE_TYPE_PREFIX = /^[A-Z]+(\/[A-Z]+)?\s+-\s+/;

  var state = eiti.explore.stateManager()
    .on('change', update);

  var hash = eiti.explore.hash()
    .on('change', state.merge);

  // buttons that expand and collapse other elements
  var filterToggle = root.select('button.toggle-filters');

  // FIXME: componentize these too
  var filterParts = root.selectAll('a[data-key]');
  filterParts.on('click', function(e, index) {
    var key = filterParts[0][index].getAttribute('data-key');
    if (key) {
      root.select('.filters-wrapper').attr('aria-expanded', true);
      filterToggle.attr('aria-expanded', true);
      root.select('.filter-description_closed').attr('aria-expanded', true);
      document.querySelector('#'+ key + '-selector').focus();
    }
    d3.event.preventDefault();
  });

  var model = eiti.explore.model(eiti.data.path + 'reconciliation/revenue.tsv')
    .transform(removeRevenueTypePrefix)
    // .filter('commodity', function(data, commodity) {
    //   // console.log('filter', data, commodity)
    //   return data.filter(function(d) {
    //     return d.Commodity === commodity;
    //   });
    // })
    .filter('type', function(data, type) {
      return data.filter(function(d) {
        return d.revenueType === type;
      });
    })
    .on('prefilter', function(key, data) {
      if (key === 'commodity') {
        // updateCommoditySelector(data);
        updateRevenueTypeSelector(data);
      }
    });

  var filters = root.selectAll('.filters [name]')
    .on('change', filterChange);

  var search = root.select('#company-name-filter');
  console.log('root',root)
  search
    .on('keyup', updateNameSearch)
    .on('clear', filterChange)
    .on('change', filterChange);
  console.log('elem',search)

  var initialState = hash.read();

  state.init(initialState);

  function update(state) {
    var query = state.toJS();
    hash.write(query);

    updateFilterDescription(state);

    grouper = d3.nest()
      .rollup(function(d) {
        // var valuesObj = {
        //   company: getter('Company Reported'),
        //   gov: getter('Company Reported'),
        //   varianceDollars: getter('Variance Dollars'),
        //   variancePercent: getter('Variance Percent')
        // }
        // return d3.sum(d, valuesObj)
        return d3.sum(d, getter('Company Reported'));
      })
      .rollup(function(d) {
        return d3.sum(d, getter('Variance Dollars'));
      })
      .sortValues(function(a, b) {
        return d3.descending(+a['Company Reported'], +b['Company Reported']);
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
    updateNameSearch();
  }

  // function updateCommoditySelector(data) {
  //   var commodities = d3.nest()
  //     .key(getter('Commodity'))
  //     .entries(data)
  //     .map(getter('key'))
  //     .sort(d3.ascending);
  //   var input = root.select('#commodity-selector');
  //   var options = input.selectAll('option.value')
  //     .data(commodities, identity);
  //   options.enter().append('option')
  //     .attr('class', 'value')
  //     .attr('value', identity)
  //     .text(identity);
  // }

  function updateRevenueTypeSelector(data) {
    // console.log('data',data)
    var commodities = d3.nest()
      .key(getter('type'))
      .entries(data)
    // console.log(commodities)
    commodities.map(getter('key'))
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
    // console.log('=',data)
    var types = grouper.entries(data)
    // console.log(types)
    types.map(function(d) {
        console.log('````',d)
        return {
          name: d.key,
          value: d.values
        };
      });
    var extent = d3.extent(types, getter('value'));
    revenueTypeList.call(renderSubtypes, types, extent);
  }

  function updateCompanyList(data) {
    var companies = d3.nest()
      .key(getter('Company'))
      .entries(data)
      .map(function(d) {
        var total = d3.sum(d.values, getter('Company Reported'));

        // console.log(d)
        var obj = {
          name: d.key,
          total: total,
          types: grouper.entries(d.values)
            .map(function(d) {
              // console.log('===>', d)
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
        console.log('==>', obj)
        return obj

      });
    // console.log('c',companies)
    var items = companyList.selectAll('tbody.company')
      .data(companies, getter('name'));
    // console.log(items)
    items.exit().remove();

    var enter = items.enter().append('tbody')
      .attr('class', 'company subgroup')
      .append('tr')
        .attr('class', 'name');
    enter.append('th')
      .attr('class', 'subregion-name')
      .text(getter('name'));
    enter.append('th')
      .attr('class', 'subtotal value');
    enter.append('th')
      .attr('class', 'subtotal-label');

    items.sort(function(a, b) {
      return d3.descending(a.total, b.total);
    });

    items.select('.subtotal-label')
      .text(function(d) {
        // console.log(d)
        return d.types.length > 1 ? 'Company Reported' : '';
      });

    items.select('.subtotal')
      .text(function(d) {
        // console.log(d)
        return d.types.length > 1 ? formatNumber(d.total) : '';
      });

    var extent = d3.extent(companies, getter('total'));
    items.call(renderSubtypes, getter('types'), extent);
  }

  function renderSubtypes(selection, types, extent) {
    var items = selection.selectAll('.subtype')
      .data(types, getter('name'));

    items.exit().remove();
    items.enter().append('tr')
      .attr('class', 'subtype')
      .call(setupRevenueItem);

    items
      .call(updateRevenueItem, extent)
      .sort(function(a, b) {
        return d3.descending(a.value, b.value);
      });
  }

  function updateNameSearch() {
    // console.log(search.property('value'))
    var query = search.property('value').toLowerCase() || '';
    var items = companyList.selectAll('.company');
    if (query) {
      items
        .style('display', function(d) {
          d.index = d.name.toLowerCase().indexOf(query)
          return d.index > -1 ? null : 'none';
        })
        .filter(function(d) {
          return d.index > -1;
        })
        .select('.subregion-name')
          .html(function(d) {
            var name = d.name;
            var start = d.index;
            var end = d.index + query.length;
            return [
              name.substr(0, start),
              '<span class="hilite">',
              name.substr(start, query.length),
              '</span>',
              name.substr(end)
            ].join('');
          });
    } else {
      items
        .style('display', null)
        .select('.subregion-name')
          .text(getter('name'));
    }
  }

  function setupRevenueItem(selection) {
    selection.append('td')
      .attr('class', 'name');
    selection.append('td')
      .attr('class', 'value');
    selection.append('td')
      .attr('class', 'bar')
      .append(function() {
        // XXX this is a document.registerElement() workaround
        return new EITIBar(); // jshint ignore:line
      });
  }

  function updateRevenueItem(selection, extent) {

    selection.select('.name')
      .text(getter('name'));

    selection.select('.value')
      .text(function(d) {
        // console.log('val',d)
        return formatNumber(d.value);
      });
    // console.log('s',getter('value'))
    var bar = selection.select('eiti-bar')
      .attr('value', getter('value'));

    if (extent) {
      bar
        .attr('min', Math.min(0, extent[0]))
        .attr('max', extent[1]);
    }
  }

  function updateFilterDescription(state) {
    var desc = root.selectAll('[data-filter-description]');

    var data = {
      type: state.get('type') || 'All revenue',
      government: state.get('government'),
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
      row.revenueType = row['Type'];
    }
  }

  function filterChange() {
    state.set(this.name, this.value);
  }

  function identity(d) {
    return d;
  }

})(this);
