$(document).ready(function(){

  var jsonFilePath= '';
  if (document.URL.includes('/explore/exporte/')) {
    jsonFilePath = "../../data/graphs/exportePie.json";
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
        legend:{ show: true },
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
