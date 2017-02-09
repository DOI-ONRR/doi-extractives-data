$(document).ready(function(){

  var jsonData = [];
  var category = [];
  var isEn = document.URL.search('/en/');
  var ticks = [];
  var labels = [];
  var jsonFilePath= '';

  if (document.URL.search('/explore/exporte/') > 1) {
    jsonFilePath = "../../data/graphs/exporte.json";
  } else if (document.URL.search('/explore/staatliche-subventionen/') > 1) {
    jsonFilePath = "../../data/graphs/subventionen1.json";
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
    var colors = jsondata.color;
    var chartTitle = (isEn > 1) ? jsondata.title_en : jsondata.title;
    plotGraph('chart'+(number+1),jsonData, jsondata, chartTitle, colors, ticks, labels);
  }

  function plotGraph(chart, data, jsondata, chartTitle, colorsData, ticks, labels) {
    $('#'+chart).height(((jsondata.data.length < 2) ? 2:jsondata.data.length) * ((jsondata.data[0].length < 2) ? 2:jsondata.data[0].length) * 40);
    plot2b = $.jqplot(chart, data, {
        animate: !$.jqplot.use_excanvas,
        seriesDefaults: {
            renderer:$.jqplot.BarRenderer,
            pointLabels: { show: true, location: 'e', edgeTolerance: -15 },
            shadowAngle: 135,
            rendererOptions: {
                barDirection: 'horizontal',
                barMargin: 2,
                barWidth: 15
            }
        },
        seriesColors: colorsData,
        grid: {
            borderColor: 'white',
            shadow: false,
            drawBorder: true,
            background: '#d2dce6',
          },
        axes: {
            yaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                autoscale: false,
                tickOptions:{
                showGridline: false
              },
            },
            xaxis: {
              ticks: ticks,
              autoscale : false
            }
        },
        legend:{
          show: true,
          location:'s',
          placement: 'outside',
          labels: labels
        },
        title: chartTitle
    });
    $(".jqplot-xaxis-tick").last().text('Mio. €');
  }
});
