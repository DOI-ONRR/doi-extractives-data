$(document).ready(function(){

  var jsonData = [];
  var category = [];
  var isEn = document.URL.includes('/en/');
  var ticks = [];
  var labels = [];
  var jsonFilePath= '';

  if (document.URL.includes('/explore/exporte/')) {
    jsonFilePath = "../../data/graphs/exporte.json";
  }

  $.ajax({
    type: "GET",
    url: jsonFilePath,
    dataType: "text",
    success: function(data) {processData(data);}
  });

  function processData(data) {

    var jsonresponce = JSON.parse(data);
    for(var i=0; i<jsonresponce.length; i++) {
      renderChart(jsonresponce[i], i);
    }
  }

  function renderChart(jsondata, number) {

    jsonData = jsondata.data;
    category = jsondata.categories;
    title = jsonData.title;
    ticks= jsondata.xAxis;
    labels= jsondata.labels;
    var colors = jsondata.colors;
    var chartTitle = isEn ? jsondata.title_en : jsondata.title;

    plotGraph(jsonData, chartTitle, colors, ticks, labels);
  }

  function plotGraph(data, chartTitle, colorsData, ticks, labels) {
    plot2b = $.jqplot('chart1', data, {
        seriesDefaults: {
            renderer:$.jqplot.BarRenderer,
            pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
            shadowAngle: 135,
            rendererOptions: {
                barDirection: 'horizontal'
            }
        },
        seriesColors: colorsData,
        grid: {
            background: '#fff',
        },
        axes: {
            yaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                autoscale: false
            },
            xaxis: {
              tickOptions:{
                showGridline: false
              },
              ticks: ticks,
              autoscale : false
            }
        },
        legend:{
          show: true,
          location:'e',
          labels: labels
        },
        title: chartTitle
    });
  }
});
