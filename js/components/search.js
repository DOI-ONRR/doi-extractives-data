$( document ).ready(function() {
  // Beckley Search Form
  //
  // As a work of the United States Government, this package is in the public domain within the United States. Additionally, we waive copyright and related rights in the work worldwide through the CC0 1.0 Universal public domain dedication.
  //
  // By Sean Herron <sean@herron.io>
  //

  /**
   * Returns parameter from GET query string
   *
   * Note that in application/x-www-form-urlencoded strings
   * (such as the GET query), a `+` will replace `%20` so we
   * need to _untranslate_ that back into `%20` before decoding.
   * The _actual_ `+` is safely encoded as `%2B`, however, so
   * we do not have to worry about losing `+`s
   *
   * @param {string} param - Which value to extract by name in name=value
   * @returns {string} Value of first requested param else ''
   */
  function getQueryParam(param) {
    return decodeURIComponent(window.location.search
      .slice(1) // drop the leading '?'
      .split('&') // split into name=value pairs
      .map(function(pair) { return pair.split('=') }) // split pairs into [name, value]
      .filter(function(pair) { return pair[0] === param }) // return matching pairs
      .map(function(pair) { return pair[1] }) // but only return the value
      .concat( '' ) // add a default in case didn't find any
      .shift() // return first match or empty string if none available
      .replace(/[+]/g, '%20') // untranslate `+` into `%20` (see above)
    );
  }

  /**
   * Returns URL for search request
   *
   * @param {string} query - Raw string holding search terms/query
   * @param {string} apiKey - Raw string holding API key for api.data.gov
   * @param {object} [options] - Optional search parameters
   * @param {number} [options.size=10] - How many results to fetch
   * @param {number} [options.from=0] - Offset to start from for paging
   * @returns {string} URL for desired search
   */
  function apiSearchUrl( query, apiKey, options ) {
    var q = encodeURIComponent( query );
    var size = (options && options.size) || 10;
    var from = (options && options.from) || 0;

    return (
      'https://api.data.gov/beckley-federalist/v0/resources/eiti/?' +
      'q=' + q + '&size=' + size + '&from=' + from + '&api_key=' + apiKey
    );
  }

  function localSearchUrl( query, options ) {
    var q = encodeURIComponent( query );
    var size = (options && options.size) || 10;
    var from = (options && options.from) || 0;

    return '/search-results/?q=' + q + '&size=' + size + '&from=' + from;
  }

  /**
   * Returns HTML string of Glyph for given content type
   *
   * @param {string} contentType - given document content type
   * @returns {string} glyph and label for content type or generic default
   */
  function getContentTypeGlyph(contentType) {
    var contentTypes = {
      'text/html':       '<span class="glyphicon glyphicon-link"></span> Website',
      'application/pdf': '<span class="glyphicon glyphicon-file"></span> PDF',
      'default':         '<span class="glyphicon glyphicon-file"></span> ' + contentType
    };

    return contentTypes[contentType]
      ? contentTypes[contentType]
      : contentTypes['default']
  }

  var query = getQueryParam('q'),
      size  = parseInt(getQueryParam('size'), 10) || 10,
      from  = parseInt(getQueryParam('from'), 10) || 0;

  $('.search-string').text( query );
  $('.site-search-text').attr('value', query );

  if ( ! query ) {
    $('.search-no-results').show();
    $('.loading').remove();
    $('.search-results-count').append( 0 + ' search results');
    return;
  }

  $('input.q').val( query );
  $('.search-result-list').html(
    '<div class="loading">' +
      '<span class="glyphicon glyphicon-refresh"></span> Loading' +
    '</div>'
  );

  $.ajax({
    url: apiSearchUrl( query, eiti.beckleyApiKey, {
      size: size,
      from: from
    }),
    cache: false,
    dataType: 'json'
  })
    .done(function(json) {
      var pagesText = {
        from: from + 1,
        to: from + size + 1
      };

      $('.loading').remove();
      $('.search-results-count').append( pagesText.from + '-' + pagesText.to + ' of ' + json.hits.total + ' search results');

      if (json.hits.total == 0){
        $('.search-no-results').show();
      }
      else{
        $('.search-no-results').remove();
      }

      var hits = json.hits.hits.map(function(hit) {
        var tags = (hit._source.tag || [])
          .map(function(tag) {
            return (
              '<span class="search-result-list-tag">&nbsp;' +
                '<a href="' + localSearchUrl(tag, {size: size, from: from}) + '" title="Search for ' + tag + '">' +
                  tag +
                '</a>&nbsp;' +
              '</span>'
            );
          });

        var contentType = getContentTypeGlyph(hit._source.content_type);

        return (
          '<article class="search-result-list">' +
            '<h1><a href="' + hit._source.url + '" target="_blank">' +
              hit._source.title +
            '</a></h1>' +
            '<p>' + hit._source.description + '</p>' +
            '<p>Tagged&nbsp;/' + tags.join('') + '</p>' +
          '</article>'
        );
      });

      $('.search-results-container .search-results-container')
        .append( hits.join('') );

      var paging = {
        needsPrevLink: from > 0,
        needsNextLink: (from + size) < json.hits.total,
        urlPrev: localSearchUrl(query, { size: size, from: Math.max(0, from - size - 1) }),
        urlNext: localSearchUrl(query, { size: size, from: Math.min(json.hits.total - 1, from + size + 1) }),
        titlePrev: 'Previous page of search results',
        titleNext: 'Next page of search results'
      };

      var links = [ 'Prev', 'Next' ]
          .filter(function(link){ return paging[ 'needs' + link + 'Link' ] })
          .map(function(link){
            return (
              '<a href="' + paging['url' + link] + '" title="' + paging['title' + link] + '">' +
                link +
              '</a>'
            )
          })
          .join(' | ')

      $('.search-results-container .search-results-container').append(links);
    });
});
