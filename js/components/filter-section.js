(function() {
  console.log('ya')
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }


  var attached = function() {
    var root = d3.select(this);
    var filterItems = root.selectAll('[filter-item]');
    var chartSelectors = root.selectAll('.chart-selector');
    var form = d3.select(document.querySelector('.filter-form'))

    var formItems = form.selectAll('.filter-input')

    filterItems
      .attr('aria-hidden', function(d) {
        var item = d3.select(this).attr('filter-item')
        var value = getQueryVariable(item)
        var isNotVisible = value === 'false' || value === false;
        var formRelative = document
          .querySelectorAll()

        var isChecked = isNotVisible ? null : true;
        d3.select(".filter-form [name='" + item + "']")
          .attr('checked', isChecked)

        return isNotVisible;
      })

    function toggleCharts() {
      var visibleItems = filterItems
        .filter(function(d) {
          var isVisible = d3.select(this).attr('aria-hidden');
          return isVisible == 'false' || !isVisible;
        })
        .empty()

      console.log('visibleItems', visibleItems)

      if (visibleItems) {
        chartSelectors.attr('aria-hidden', true);
      } else {
        chartSelectors.attr('aria-hidden', null);
      }
    }

    toggleCharts();
    formItems.on('change.component', toggleCharts)
  };

  var detached = function() {
  };

  document.registerElement('filter-section', {
    'extends': 'div',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        detachedCallback: {value: detached}
      }
    )
  });

})();
