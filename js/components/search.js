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

  var query = GetURLParameter('q') || '';
  $(".search-string").append(query.replace(/%20/g,' '));
  $("#site-search-text").attr('value',query.replace(/%20/g,' '));

  if(query) {
    $("input#q").val(query);
    $("#search-result-list").append('<div class="loading"><span class="glyphicon glyphicon-refresh"></span> Loading</div>');
    $.ajax({
      url: "https://api.data.gov/beckley-federalist/v0/resources/eiti/?q=" + query + "&size=200&from=0&api_key=LXJh2PKSC6zxY0YNuBRYgIj2JxSPcDwSPCZuHBG1",
      cache: false,
      dataType: "json"
    })
      .done(function(json) {
        $(".loading").remove();
        $("#search-results-count").append( json.hits.total + ' search results');
        if (json.hits.total == 0){
          $("#search-no-results").show();
        }
        else
          $("#search-no-results").remove();

        $.each(json.hits.hits, function(i, hit){

        var result_description = hit._source.description;

          var tags = '';
          if(hit._source.tag) {
            $.each(hit._source.tag, function(i, tag) {
              tags+='&nbsp;<a href="../search/?q=' + tag + '" title="Search for '+tag+'">' + tag + '</a>&nbsp;/'
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
            +'<p>Tagged&nbsp;/'
            + tags
            +'</p>'
            +'</article>');
        });
      });
  }
  else {
    $("#search-no-results").show();
    $(".loading").remove();
    $("#search-results-count").append( 0 + ' search results');

  }
});
