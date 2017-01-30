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
            return '<span class="search-result-list-tag">&nbsp;' +
                     '<a href="' + '/search-results/?q=' + encodeURIComponent(tag) +
                     '" title="Search for ' + tag + '">' +
                       tag +
                     '</a>&nbsp;' +
                   '</span>';
          });
        var external = item.internal
          ? ''
          : ' target="_blank" ';
        var baseurl = item.internal
          ? window.location.origin
          : '';
        appendString += '<article class="search-result-list">' +
                          '<h1><a href="' + baseurl + item.url + '"' + external + '>' +
                            item.title +
                          '</a></h1>' +
                          '<p>' + item.description + '</p>' +
                          '<p>Tagged&nbsp;/' + tags.join('/') + '</p>' +
                        '</article>';
      }
      $searchResults.html(appendString);
    } else {
      $('.search-no-results').show();
      $('.search-header').hide();
    }
  }

  function updateContext(results, searchTerm) {
    var resultsLength = results.length || 0;
    searchTerm = searchTerm || '';
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

  // Initalize lunr with the fields it will be searching on. I've given title
  // a boost of 10 to indicate matches on this field are more important.
  var idx = lunr(function () {
    this.field('id');
    this.field('title', { boost: 10 });
    this.field('description');
    this.field('tag', { boost: 10 });
    this.field('internal', { boost: 100 });
  });

  for (var key in window.store) {
    idx.add({
      'id': key,
      'title': window.store[key].title,
      'description': window.store[key].description,
      'tag': window.store[key].tag,
      'internal': window.store[key].internal,
    });
  }

  var searchTerm = getQueryVariable('q') ||
    document.querySelector('.search-box').value;

  var results = idx.search(searchTerm);
  displaySearchResults(results, window.store);


  function searchIndex(searchTerm) {
    $('.search-no-results').hide();
    $('.search-header').show();
    var results = idx.search(searchTerm);
    displaySearchResults(results, window.store);
    updateContext(results, searchTerm);
  }

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
