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
  }
  
  var query = GetURLParameter('q');
  
  if(query) {
    console.log('query found')
    $("input#q").val(query);
    $("#search-result-list").append('<div class="loading"><span class="glyphicon glyphicon-refresh"></span> Loading</div>');
    $.ajax({
      url: "//api.data.gov/beckley/v0/resources/eiti/?q=" + query + "&size=200&from=0&api_key=YYyGvaNdO6UF5qGfZXgHxOnOVD002wYxcBrbSvgQ",
      cache: false,
      dataType: "json"
    })
      .done(function(json) {
        console.log(json);
        $(".loading").remove();
        $("#search-results-count").append( json.hits.total + ' Search Results');
        $.each(json.hits.hits, function(i, hit){
          
        var result_description = hit._source.description;
          
          var tags = '';
          if(hit._source.tags) {
            $.each(hit._source.tags, function(i, tag) {
              tags+='<a href="/search/?q=' + tag + '">' + tag + '</a> /'
            });
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
          $("#search-results-container").append('<article class="search-result-list"><h1><a href="' 
            + hit._source.url 
            + '" target="_blank">' 
            + hit._source.title 
            + '</a></h1>'
            +'<p>' 
            + result_description 
            + '</p>'
            +'<p>Tagged /' 
            + tags 
            +'</p>'
            +'</article>');
        });
      });
  }
  else {
    console.log('no query!');
  }
});