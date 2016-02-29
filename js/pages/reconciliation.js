// globals d3, eiti, EITIBar
(function() {
  // 'use strict';

  var root = d3.select('#reconciliation');
  var filterToggle = root.select('button.toggle-filters');
  var revenueTypeList = root.select('#revenue-types');
  var companyList = root.select('#companies');

  var getter = eiti.data.getter;
  var throttle = eiti.util.throttle;
  var grouper;
  var formatNumber = eiti.format.dollarsAndCents;
  var formatPercent = eiti.format.percent;
  var roundedPercent = d3.format('%.1');
  var REVENUE_TYPE_PREFIX = /^[A-Z]+(\/[A-Z]+)?\s+-\s+/;

  var dialogWithExtension = document.querySelector('.flowchart-dialog.flowchart-columns_right');
  var extension = document.querySelector('.flowchart-stem_bottom_right_extra_long');
  var dialogBottom = document.querySelector('.flowchart-dialog_bottom');

  function setExtHeight () {
    var newHeight = dialogBottom.getBoundingClientRect().bottom -
      dialogWithExtension.getBoundingClientRect().bottom;
    extension.style.height = newHeight + 'px';
  };

  // initialize height of extension path
  setExtHeight();

  window.addEventListener('resize', throttle(setExtHeight, 150, window));

  var varianceKey = {
    'Royalties': {
      threshold: 1,
      floor: 100000,
      name: 'Royalties'
    },
    'Rents':  {
      threshold: 2,
      floor: 50000,
      name: 'Rents'
    },
    'Bonus': {
      threshold: 2,
      floor: 100000,
      name: 'Bonuses'
    },
    'Other Revenue': {
      threshold: 3,
      floor: 50000,
      name: 'Other revenue'
    },
    'Offshore Inspection Fee': {
      threshold: 2,
      floor: 20000,
      name: 'Offshore inspection fees'
    },
    'ONRR Civil Penalties': {
      threshold: 1,
      floor: 1000,
      name: 'Civil penalties'
    },
    'Bonus & 1st Year Rental': {
      threshold: 2,
      floor: 10000,
      name: 'BLM bonus and first year rentals'
    },
    'Permit Fees': {
      threshold: 3,
      floor: 10000,
      name: 'Permit fees'
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
    var varianceVal = Math.abs(d.value - d.company);

    var overThreshold = !!(varianceKey[d.name].threshold < d.variance);
    if (overThreshold) {

      if (varianceVal > varianceKey[d.name].floor) {
        return true;
      }
    }
    return false;
  }

  var model = eiti.explore.model(eiti.data.path + 'reconciliation/revenue.tsv')
    .transform(removeRevenueTypePrefix)
    .filter('type', function(data, type) {
      return data.filter(function(d) {
        return d.revenueType === type;
      });
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
    updateCompanyList(data);
    updateNameSearch();
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
