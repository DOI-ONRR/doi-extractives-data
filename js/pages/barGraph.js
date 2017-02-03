$(document).ready(function(){

  var jsonData = [];
  var category = [];
  var isEn = document.URL.includes('/en/');
  var ticks = [];
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
    console.log(ticks);
    var colors = [];
    var chartTitle = isEn ? jsondata.title_en : jsondata.title;

    // setting color values
    for (var j = 0; j < category.length; j++) {
        colors.push(category[j].color);
    }
    legendTable('legend',category);
    plotGraph(jsonData, chartTitle, colors, ticks);
  }


  function legendTable(element,category) {
    var table = document.getElementById(element);
    for(var i=0; i<category.length;i++){
      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);

      var div = document.createElement("div");
      div.style.width = '15px';
      div.style.height = '15px';
      div.style.background = category[i].color;
      cell1.appendChild(div);
      if (isEn) {
        cell2.innerHTML = category[i].cat_en;
      } else {
        cell2.innerHTML = category[i].cat;
      }
    }
  }

  function plotGraph(data, chartTitle, colorsData, ticks) {
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
        title: chartTitle
    });
  }
});
