$(document).ready(function(){

  var jsonData = [];
  var jsonData1 = [];
  var category = [];

  $.ajax({
    type: "GET",
    url: "../../data/regional/charts.json",
    dataType: "text",
    success: function(data) {processData(data);}
  });

function processData(data) {

  var jsonresponce = JSON.parse(data);

  for(var i=0; i<=jsonresponce.length; i++) {
    renderChart(jsonresponce[i], i);
  }

/* Start First Graph */
function renderChart(jsondata, number) {

  jsonData = jsondata.data;
  category = jsondata.categories;
  console.log(jsondata.categories);

  var dataSlices = [];
  var ticks = [];
  var colors = [];
  jsonData.sort(orderData("Value"));

  // setting color values
  for (var i = 0; i < jsonData.length; i++) {
    for (var j = 0; j < category.length; j++) {
      if (jsonData[i].cat == category[j].cat) {
        colors.push(category[j].color);
      }
    }
  }

  $.each(jsonData, function (entryindex, entry) {
    dataSlices.push(entry['Value']);
    if(document.URL.includes('/en/')) {
      ticks.push(entry['Label_en']);
    } else {
      ticks.push(entry['Label']);
    }
  });
  legendTable('legend'+(number+1),category);
  // console.log(dataSlices);
  // console.log(colors);
  // console.log(jsonData);
  plotGraph('chart'+(number+1),dataSlices,colors,traslation.chart_1_tittle,ticks,jsonData);
}

/* end First Graph */

/* Start Second Graph */
    // var dataSlices1 = [];
    // var ticks1 = [];
    // var colors1 = [];
    // jsonData1.sort( orderData("Value"));
    //
    // for (var i = 0; i < jsonData1.length; i++) {
    //   for (var j = 0; j < category1.length; j++) {
    //     if (jsonData1[i].cat == category1[j].cat) {
    //       colors1.push(category1[j].color);
    //     }
    //   }
    // }
    // $.each(jsonData1, function (entryindex, entry) {
    //   dataSlices1.push(entry['Value']);
    //   if(document.URL.includes('/en/')) {
    //     ticks1.push(entry['Label_en']);
    //   } else {
    //     ticks1.push(entry['Label']);
    //   }
    // });
    // legendTable("legend2",category1);
    // plotGraph('chart2',dataSlices1,colors1,traslation.chart_2_tittle,ticks1,jsonData1);
/* end Second Graph */
}

function orderData(prop) {
  console.log(prop);
  return function(a,b) {
    if ( a[prop] > b[prop]){
        return 1;
    } else if( a[prop] < b[prop] ){
        return -1;
    }
    return 0;
 }
}

function legendTable(element,data) {
  var table = document.getElementById(element);
  for(var i=0; i<data.length;i++){
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    var div = document.createElement("div");
    div.style.width = '15px';
    div.style.height = '15px';
    div.style.background = data[i].color;
    cell1.appendChild(div);
    if (document.URL.includes('/en/')) {
      cell2.innerHTML = data[i].cat_en;
    } else {
      cell2.innerHTML = data[i].cat;
    }
  }
}

function plotGraph(chart,slices,colorsData,title,ticksData,jsonDatas) {
  function tickFormatter(format, val) {
    for(var i=0;i<jsonDatas.length; i++){
      if(jsonDatas[i].Value === val){
        if (document.URL.includes('/en/')) {
          val= val +" "+ jsonDatas[i].unit_en;
        } else {
          val= val +" "+ jsonDatas[i].unit;
        }
      }
    }
    return val;
  }
  $('#'+chart).height(jsonDatas.length * 40);
  var plot2 = $.jqplot(chart, [slices], {
      animate: !$.jqplot.use_excanvas,
      seriesDefaults:{
          renderer:$.jqplot.BarRenderer,
          shadowAngle: 135,
          rendererOptions: {
              barDirection: 'horizontal',
              varyBarColor: true,
              fillToZero: true
          },
          pointLabels: {show: true, edgeTolerance: -15, location: 'e'}
      },
      seriesColors: colorsData,
      series:[
          {label: ['A','B']}
      ],
      title: title,
      grid: {
          background: '#fff',
      },
      axes: {
          xaxis: {
            // pad: 1.05,
            // tickOptions: {formatString: '%d (t)'}
            tickOptions:{formatter: tickFormatter},
            showTicks: false,
          },
          yaxis: {
              renderer: $.jqplot.CategoryAxisRenderer,
              ticks: ticksData
          }
        }
    });
  }
});
