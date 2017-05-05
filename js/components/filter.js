// var slugify = require('slugify')

(function() {
  console.log('yo')
  var slugs = [];
  var slugMap = d3.map(slugs)

  function createQueryString() {
    console.log('setSlug', slugMap)
    return slugMap
      .entries()
      .map(function(entry, index) {
        var symbol = index == 0 ? '?' : '&'
        return symbol + entry.key + '=' + entry.value
      })
      .join('')
  }

  function initSlugMap() {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    d3.map(vars, function(v) {

      var keyValue = v.split('=');
      if (keyValue[0] && keyValue[0] != 'undefined' &&
        keyValue[1] && keyValue[1] != 'undefined') {
        slugMap.set(keyValue[0], keyValue[1]);
      }
    });
  }

  initSlugMap();

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

  $(function() {
    $('.filter-form input').on('change.was-selected', function(event) {
      var slug = this.name
      var href = window.location.protocol + '//' + window.location.host + window.location.pathname;
      if (this.checked) {
        slugMap.set(slug, true);
        queryString = createQueryString()
        window.history.pushState('object or string', 'Title', href + queryString);
        var filterItem = "[filter-item='" + slug + "']";
        $(filterItem).attr('aria-hidden', false);

      } else {
        slugMap.set(slug, false)
        queryString = createQueryString()
        window.history.pushState('object or string', 'Title', href + queryString);
        var filterItem = "[filter-item='" + slug + "']";
        // var $filterItems = $('[filter-item]');
        // $filterItems.hide();
        $(filterItem).attr('aria-hidden', true);
      }
    });


    // Filter mode
    var filterMode = false;
    $('#filter-button').on('click.filter-mode', function() {
      $('body').toggleClass('filter-mode');
      filterMode = !filterMode;
    });



    $('section').on('click.novel', function() {
      if(filterMode) {
        var relatedHash = "#" + $(this).attr('id');
        if (!$(this).hasClass('container') && (window.location.hash === relatedHash)) {
          $(this).attr('aria-hidden', true);
          var $navItem = $('.sticky_nav-nav_item[href="' + relatedHash + '"]');
          $navItem.attr('aria-hidden', true);
          $navItem.next('ul').attr('aria-hidden', 'true');
        }
      }
    });
  })

})();
