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
  var formatPercent = eiti.format.percent;
  var REVENUE_TYPE_PREFIX = /^[A-Z]+(\/[A-Z]+)?\s+-\s+/;

  var state = eiti.explore.stateManager()
    .on('change', update);

  var hash = eiti.explore.hash()
    .on('change', state.merge);

  function isException (val, vart) {
    if (typeof(val) === 'string') {
      val = val.trim()
      return (val === 'DNP' || val === 'DNR' || val === 'N/A');
    }
  }

  function isMaterial (d) {
    var varianceKey = {
      'Royalties': 1,
      'Rents':  2,
      'Bonus': 2,
      'Other Revenue': 3,
      'Offshore Inspection Fee': 2,
      'Civil Penalties': 1,
      'Bonus & 1st Year Rental': 2,
      'Permit Fees': 3,
      'Renewables': 'N/A',
      'AML Fees': 2,
      'Civil Penalties': 3,
      'Corporate Income Tax Company': 1
    }

    return varianceKey[d.name] < d.variance
      ? 'red'
      : '';
  }

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

    .filter('type', function(data, type) {
      return data.filter(function(d) {
        return d.revenueType === type;
      });
    })
    .on('prefilter', function(key, data) {
        updateRevenueTypeSelector(data);
    });

  var filters = root.selectAll('.filters [name]')
    .on('change', filterChange);

  var search = root.select('#company-name-filter');
  search
    .on('keyup', updateNameSearch)
    .on('clear', filterChange)
    .on('change', filterChange);

  var initialState = hash.read();

  state.init(initialState);

  function update(state) {
    var query = state.toJS();
    hash.write(query);

    updateFilterDescription(state);

    grouper = d3.nest()
      .rollup(function(leaves) {

        return leaves.map(function(d){
          return {
            value: d['Government Reported'],
            company: d['Company Reported'],
            variance: d['Variance Percent'],
            varianceDollars: d['Variance Dollars']
          };
        })
      })
      .sortValues(function(a, b) {
        return d3.descending(+a['Government Reported'], +b['Government Reported']);
      });

    var hasType = !!query.type;

    grouper.key(getter('revenueType'));

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
    updateRevenueTypes(data);
    updateCompanyList(data);
    updateNameSearch();
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

    var types = d3.nest()
      .key(getter('Type'))
      .entries(data)
      .map(function(data) {

        var totalGov = d3.sum(data.values, getter('Government Reported'));

        var totalCompany = d3.sum(data.values, getter('Company Reported'));
        var variance = (totalGov === 0)
          ? 0
          : (100 * d3.sum(data.values, getter('Variance Dollars')) / totalGov);

        var obj = {
          name: data.key,
          totalGov: totalGov,
          totalCompany: totalCompany,

          variance: variance,
          types: grouper.entries(data.values)
            .map(function(d) {
              // console.log('--->', d)
              return {
                value: d.values[0].value,
                company: d.values[0].company,
                variance: variance,
                varianceDollars: d3.sum(data.values, getter('Variance Dollars'))
              };
            })
        }
        return obj
      });

    var extent = d3.extent(types, getter('variance'));
    revenueTypeList.call(renderTotals, types, extent);
  }

  function updateCompanyList(data) {
    var companies = d3.nest()
      .key(getter('Company'))
      .entries(data)
      .map(function(data) {
        var total = d3.sum(data.values, getter('Government Reported'));

        var obj = {
          name: data.key,
          total: total,
          types: grouper.entries(data.values)
            .map(function(d) {
              var variance = isException(d.values[0].variance)
                ? d.values[0].variance
                : Math.abs(d.values[0].variance)

              return {
                name: d.key,
                value: d.values[0].value,
                company: d.values[0].company,
                variance: variance
              };
            })
        };

        return obj

      });

    // var hasChildren = companyList.select('.list-heading')[0][0];

    // if (!hasChildren) {
    //   var heading = companyList
    //     .append('thead')
    //     .attr('class', 'list-heading')
    //     .append('tr')
    //   heading.append('th')
    //     .attr('class', 'narrow')
    //     .text('')
    //   heading.append('th')
    //     .html(function(d) {
    //       return 'amount reported by company (<strong>co</strong>) and by government (<strong>gov</strong>)';
    //     });
    //   heading.append('th')
    //     .attr('class', 'centered')
    //     .html(function(d) {
    //       return 'variance (<span class="red">red</span> indicates <span class="term term-p" data-term="material variance" title="Click to define" tabindex="0">material var.<i class="icon-book"></i></span>)';
    //     });
    // }

    var items = companyList.selectAll('tbody.company')
      .data(companies, getter('name'));

    items.exit().remove();

    var enter = items.enter().append('tbody')
      .attr('class', 'company subgroup')
      .append('tr')
        .attr('class', 'name');
    enter.append('th')
      .attr('class', 'subregion-name narrow')
      .text(getter('name'));
    enter.append('th')
      .attr('class', 'subtotal value');
    enter.append('th')
      .attr('class', 'subtotal-label');

    items.sort(function(a, b) {
      return d3.descending(Math.abs(a.total), Math.abs(b.total));
    });
    // debugger
    // items.select('.subtotal-label')
    //   .html(function(d) {
    //     // console.log(d)
    //     return 'variance (<span class="red">red</span> indicates <span class="term term-p" data-term="material variance" title="Click to define" tabindex="0">material var.<i class="icon-book"></i></span>)';
    //     // return d.types.length > 1 ? 'variance (<span class="red">red</span> indicates <span class="term term-p" data-term="material variance" title="Click to define" tabindex="0">material var.<i class="icon-book"></i></span>)' : '';
    //   });

    // items.select('.subtotal')
    //   .html(function(d) {
    //     // console.log(d)
    //     return 'amount reported by company (<strong>co</strong>) and by government (<strong>gov</strong>)';
    //     // return d.types.length > 1 ? 'amount reported by company (<strong>co</strong>) and by government (<strong>gov</strong>)' : '';
    //   });
    //   // Total Gov Reported Revenue
    //   // .text(function(d) {
    //   //   // console.log(d)
    //   //   return d.types.length > 1 ? formatNumber(d.total) : '';
    //   // });

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
        return d3.descending(Math.abs(a.value), Math.abs(b.value));
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
      .attr('class', 'name narrow');
    selection.append('td')
      .attr('class', 'value');
    selection.append('td')
      .attr('class', 'variance');
  }

  function updateRevenueItem(selection, extent) {

    selection.select('.name')
      .text(getter('name'));


    selection.select('.value')
      .html(function(d) {
        var company = isException(d.company)
          ? d.company
          : formatNumber(d.company)

        var multiLine = formatNumber(d.value) +
          ' <span class="reportee">gov</span>' +
          '</br>' +
          company +
          ' <span class="reportee">co</span>';
        return multiLine;
      });

    selection.select('.variance')
      .html(function(d) {

        var variance = isException(d.variance, 'var')
          ? d.variance
          : formatPercent(d.variance / 100)

        var color = isMaterial(d);

        return '<span class="' + color + '">' + variance + '</span>';
      });
  }

  function renderTotals(selection, types, extent) {
    var items = selection.selectAll('.subtype')
      .data(types, getter('name'));

    items.exit().remove();
    items.enter().append('tr')
      .attr('class', 'subtype')
      .call(setupTotals)

    items
      .call(updateTotals, extent)
      .sort(function(a, b) {
        return d3.descending(a.variance, b.variance);
      });
  }

  function setupTotals(selection) {
    selection.append('td')
      .attr('class', 'name narrow');
    selection.append('td')
      .attr('class', 'variance')
    selection.append('td')
      .attr('class', 'bar')
      .append(function() {
        // XXX this is a document.registerElement() workaround
        return new EITIBar(); // jshint ignore:line
      });
  }

  function updateTotals(selection, extent) {

    selection.select('.name')
      .text(getter('name'));

    var bar = selection.select('eiti-bar')
      .attr('value', function(d) {
        return d.types[0].variance;
      });

    if (extent) {
      bar
        .attr('min', Math.min(0, extent[0]))
        .attr('max', extent[1]);
    }
    selection.select('.variance')
      .text(function(d) {
        return formatPercent(Math.abs(d.types[0].variance / 100));
      });
  }

  function updateFilterDescription(state) {
    var desc = root.selectAll('[data-filter-description]');

    var data = {
      type: state.get('type') || 'All revenue',
      government: state.get('government'),
    };

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
    state.set(this.name, this.value, this.company, this.variance);
  }

  function identity(d) {
    return d;
  }

})(this);
