(function() {
  function displaySearchResults(results, store) {
    var $searchResults = $('.search-results-container .search-results-container');
    $searchResults.html('');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = store[results[i].ref];

        var tags = (item.tag || [])
          .map(function(tag) {
            return (
              '<span class="search-result-list-tag">&nbsp;' +
                '<a href="' + "/search-results/?query=" + encodeURIComponent(tag) + '" title="Search for ' + tag + '">' +
                  tag +
                '</a>&nbsp;' +
              '</span>'
            );
          });
        appendString += '<article class="search-result-list">' +
                          '<h1><a href="' + item.url + '" target="_blank">' +
                            item.title +
                          '</a></h1>' +
                          '<p>' + item.description + '</p>' +
                          '<p>Tagged&nbsp;/' + tags.join('/') + '</p>' +
                        '</article>'
      }
      $searchResults.html(appendString);
    } else {
      $('.search-no-results').show();
      $('.search-header').hide();
    }
  }

  function updateContext(results, searchTerm) {
    var resultsLength = results.length || 0;
    var searchTerm = searchTerm || '';
    $('.search-results-count').val(resultsLength);
    $('.search-results-count').text(resultsLength);
    $('.search-string').text(searchTerm);
    $('.search-box').val(searchTerm);
  }

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

  function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }

  window.updateQueryStringParameter = updateQueryStringParameter;

  // Initalize lunr with the fields it will be searching on. I've given title
  // a boost of 10 to indicate matches on this field are more important.
  var idx = lunr(function () {
    this.field('id');
    this.field('title', { boost: 10 });
    this.field('description');
    this.field('tag', { boost: 10 });
  });

  for (var key in window.store) { // Add the data to lunr
    idx.add({
      'id': key,
      'title': window.store[key].title,
      'description': window.store[key].description,
      'tag': window.store[key].tag,
    });

    window.idx = idx;
    var results = idx.search(searchTerm); // Get lunr to perform a search
  }

  displaySearchResults(results, window.store); // We'll write this in the next section


  function searchIndex(searchTerm) {
    $('.search-no-results').hide();
    $('.search-header').show();
    var results = idx.search(searchTerm);
    displaySearchResults(results, window.store);
    updateContext(results, searchTerm);
  }


  var searchTerm = getQueryVariable('query') || document.querySelector('.search-box').value;


  if (searchTerm.length > 0) {
    searchIndex(searchTerm);
  } else {
    updateContext(results, searchTerm);
  }


  $('.search-box').on('keyup', function() {
    var searchValue = this.value;
    searchIndex(searchValue);
  });
})();
