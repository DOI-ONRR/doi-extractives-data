$( document ).ready(function() {
  // Beckley Search Form
  //
  // As a work of the United States Government, this package is in the public domain within the United States. Additionally, we waive copyright and related rights in the work worldwide through the CC0 1.0 Universal public domain dedication.
  //
  // By Sean Herron <sean@herron.io>
  //
  function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  }​
  
  var query = GetURLParameter('q');
  
  if(query) {
    $("input#q").val(query);
    $("#search-result-list").append('<div class="loading"><span class="glyphicon glyphicon-refresh"></span> Loading</div>');
    $.ajax({
      url: "//api.data.gov/beckley/v0/resources/notalone/?q=" + query + "&size=200&from=0&api_key=TRuYxi0630m5Y4D3ECUjxzdaVNaShjxq6u68MkGx",
      cache: false,
      dataType: "json"
    })
      .done(function(json) {
        $(".loading").remove();
        $("#search-form").append('<div class="search-results-total"><span class="search-result-number">' + json.hits.total + '</span> Search Results</div>');
        $.each(json.hits.hits, function(i, hit){
          
        var result_description = hit._source.description;
          
          var tags = '';
          if(hit._source.tags) {
            tags+='<div class="search-result-tags">Tags:<ul>'
            $.each(hit._source.tags, function(i, tag) {
              tags+='<li><a href="/search/?q=' + tag + '">' + tag + '</a></li>'
            });
            tags+="</ul></div>"
          }
          
          var content_type = "";
          if(hit._source.content_type == "text/html") {
            content_type = '<span class="glyphicon glyphicon-link"></span> Website';
          }
          else if(hit._source.content_type == "application/pdf") {
            content_type = '<span class="glyphicon glyphicon-file"></span> PDF';
          }
          else {
            content_type = '<span class="glyphicon glyphicon-file"></span> ' + hit._source.content_type + '';
          }
          $("#search-result-list").append('
          <article class="search-result">
            <header class="search-result-header">
              <a href="' + hit._source.url + '" target="_blank">' + hit._source.title + '</a>
            </header>
            <div class="search-result-content">
              ' + result_description + '
              ' + tags + '
            </div>
            <div class="search-result-meta">
              <div class="search-result-meta-item">
                </div>
                <div class="search-result-meta-item-content">
                  ' + content_type + '
                </div>
                <div class="search-result-meta-item-content">
                  <span class="glyphicon glyphicon-arrow-right"></span> <a href="' + hit._source.url + '" target="_blank">View Document</a>
                </div>
              </div>
            </div>
          </article>');
        });
      });
  }
  else {
    console.log('no query!');
  }
});