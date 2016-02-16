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
  var roundedPercent = d3.format('%.1');
  var REVENUE_TYPE_PREFIX = /^[A-Z]+(\/[A-Z]+)?\s+-\s+/;

  var varianceKey = {
    'Royalties': {
      threshold: 1,
      floor: 100000,
      name: 'ONRR royalties'
    },
    'Rents':  {
      threshold: 2,
      floor: 50000,
      name: 'ONRR rents'
    },
    'Bonus': {
      threshold: 2,
      floor: 100000,
      name: 'ONRR bonuses'
    },
    'Other Revenue': {
      threshold: 3,
      floor: 50000,
      name: 'ONRR other revenue'
    },
    'Offshore Inspection Fee': {
      threshold: 2,
      floor: 20000,
      name: 'Offshore inspection fees'
    },
    'ONRR Civil Penalties': {
      threshold: 1,
      floor: 1000,
      name: 'ONRR civil penalties'
    },
    'Bonus & 1st Year Rental': {
      threshold: 2,
      floor: 10000,
      name: 'BLM bonus & first year rentals'
    },
    'Permit Fees': {
      threshold: 3,
      floor: 10000,
      name: 'BLM permit fees'
    },
    'Renewables': {
      threshold: 'N/A',
      floor: 'N/A',
      name: 'BLM renewables'
    },
    'AML Fees': {
      threshold: 2,
      floor: 100000,
      name: 'OSMRE AML fees'
    },
    'OSMRE Civil Penalties': {
      threshold: 3,
      floor: 0,
      name: 'OSMRE civil penalties'
    },
    'Corporate Income Tax': {
      threshold: 1,
      floor: 100000,
      name: 'Taxes'
    }
  };

  var state = eiti.explore.stateManager()
    .on('change', update);

  var hash = eiti.explore.hash()
    .on('change', state.merge);

  function isException (val, vart) {
    if (typeof(val) === 'string') {
      val = val.trim();
      return (val === 'did not participate' || val === 'did not report' || val === 'N/A');
    }
  }

  function isMaterial (d) {
    var overThreshold = !!(varianceKey[d.name].threshold < d.variance);
    if (overThreshold) {
      var varianceVal = Math.abs(d.value - d.company);
      if (varianceVal > varianceKey[d.name].floor) {
        return true;
      }
    }
    return false;
  }

  // FIXME: componentize these too
  // var filterParts = root.selectAll('a[data-key]');
  // filterParts.on('click', function(e, index) {
  //   var key = filterParts[0][index].getAttribute('data-key');
  //   if (key) {
  //     root.select('.filters-wrapper').attr('aria-expanded', true);
  //     filterToggle.attr('aria-expanded', true);
  //     root.select('.filter-description_closed').attr('aria-expanded', true);
  //     document.querySelector('#'+ key + '-selector').focus();
  //   }
  //   d3.event.preventDefault();
  // });

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
        });
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
      .text(function(name) {
        return varianceKey[name].name;
      });
  }

  function updateRevenueTypes(data) {

    var types = d3.nest()
      .key(getter('Type'))
      .entries(data)
      .map(function(data) {

        var totalGov = d3.sum(data.values, getter('Government Reported'));

        var totalCompany = d3.sum(data.values, getter('Company Reported'));
        var variance = d3.median(data.values, getter('Variance Percent'));

        var obj = {
          name: data.key,
          totalGov: totalGov,
          totalCompany: totalCompany,
          variance: variance,
          types: grouper.entries(data.values)
            .map(function(d) {
              return {
                value: d.values[0].value,
                company: d.values[0].company,
                variance: variance,
                varianceDollars: d3.sum(data.values, getter('Variance Dollars'))
              };
            })
        };
        return obj;
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
                : Math.abs(d.values[0].variance);

              return {
                name: d.key,
                value: d.values[0].value,
                company: d.values[0].company,
                variance: variance
              };
            })
        };

        return obj;

      });

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
    var query = search.property('value').toLowerCase() || '';
    var items = companyList.selectAll('.company');
    if (query) {
      items
        .style('display', function(d) {
          d.index = d.name.toLowerCase().indexOf(query);
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
      .text(function(d) {
        return varianceKey[d.name].name;
      });


    selection.select('.value')
      .html(function(d) {
        var company = isException(d.company)
          ? d.company
          : formatNumber(d.company);

        var multiLine = formatNumber(d.value) +
          ' <span class="reportee">gov</span>' +
          '</br>' +
          company +
          ' <span class="reportee">co</span>';
        return multiLine;
      });

    var refNumber = 0;
    selection.select('.variance')
      .html(function(d) {
        var variance = isException(d.variance, 'var')
          ? d.variance
          : formatPercent(d.variance / 100);

        function returnFootnote () {
          refNumber ++;
          return '<strong>' + variance +
            '<sup id="fnref:' + refNumber +
            '"><a href="#fn:' + refNumber +
            '" class="footnote hashoffset">' + refNumber +
            '</a></sup></strong>';
        }
        return isMaterial(d)
          ? returnFootnote()
          : variance;
      });
  }

  function renderTotals(selection, types, extent) {
    var items = selection.selectAll('.subtype')
      .data(types, getter('name'));

    items.exit().remove();
    items.enter().append('tr')
      .attr('class', 'subtype')
      .call(setupTotals);

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

    selection.select('.bar')
      .append('span')
      .attr('class','threshold');
  }

  function updateTotals(selection, extent) {

    selection.select('.name')
      .text(function(d) {
        return varianceKey[d.name].name;
      });

    var bar = selection.select('eiti-bar')
      .attr('value', function(d) {
        return d.types[0].variance;
      });

    if (extent) {
      bar
        .attr('min', Math.min(0, extent[0]))
        .attr('max', function(d) {
          return varianceKey[d.name].threshold;
        })
        .style('width', function(d) {
          return String(varianceKey[d.name].threshold).match(/N\/A/)
            ? 0
            : formatPercent(0.75 * varianceKey[d.name].threshold / 3);
            // 0.75 is magic number to fit bars on mobile
        })
        .attr('class','material-variance');
    }
    selection.select('.variance')
      .text(function(d) {
        return formatPercent(d.types[0].variance / 100);
      });
    selection.select('.threshold')
      .text(function(d) {
        return String(varianceKey[d.name].threshold).match(/N\/A/)
          ? varianceKey[d.name].threshold
          : roundedPercent(varianceKey[d.name].threshold / 100);
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
