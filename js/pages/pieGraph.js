$(document).ready(function(){

  var jsonFilePath= '';
  if (document.URL.search('/explore/exporte/') > 1) {
    jsonFilePath = "../../data/graphs/exportePie.json";
  } else if (document.URL.search('/explore/employment/') > 1) {
    jsonFilePath = "../../data/graphs/employment.json";
  }

  $.ajax({
    type: "GET",
    url: jsonFilePath,
    dataType: "text",
    success: function(data) {processData(data);}
  });

  function processData(data) {

    var jsonresponce = JSON.parse(data);
    plotPieGraph(jsonresponce);
  }

  function plotPieGraph(plotData) {
    var plot3 = $.jqplot('pieChart', plotData.data, {
        seriesDefaults:{
            shadow: false,
            renderer:$.jqplot.PieRenderer,
            rendererOptions:{
                dataLabelPositionFactor : 1.2,
                sliceMargin: 4,
                startAngle: -90,
                showDataLabels: true,
                dataLabelThreshold : 0,
                dataLabelFormatString:'%.2f%'
            }
        },
        seriesColors: plotData.color,
        legend:{
          show: true,
          location: $( window ).width() < 600 ? 's': 'e',
          placement: 'inside'
        },
        grid: {
            background: '#fff',
            drawBorder: false,
            drawGridlines: false,
            shadow: false
        },
        title: plotData.title
    });
  }
});
