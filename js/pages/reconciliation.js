// globals d3, eiti, EITIBar
(function() {
  'use strict';

  var root = d3.select('#reconciliation');

  var search = root.select('#company-name-filter');
  search
    .on('keyup', updateNameSearch)
    .on('change', updateNameSearch);

  var companies = root.selectAll('tbody.company')
    .datum(function() {
      var name = this.getAttribute('data-name');
      var lower = name.toLowerCase();
      return {
        name: name,
        lower: lower
      };
    });

  function updateNameSearch() {
    var query = search.property('value').toLowerCase() || '';
    if (query) {
      companies
        .attr('aria-hidden', function(d) {
          d.index = d.lower.indexOf(query);
          return d.index === -1;
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
      companies
        .attr('aria-hidden', false)
        .select('.subregion-name')
          .text(function(d) {
            return d.name;
          });
    }
  }

})();
