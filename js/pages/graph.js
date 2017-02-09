$(document).ready(function(){

  var jsonData = [];
  var category = [];
  var isEn = document.URL.search('/en/');

  /* default call*/
  ajaxCall();

  /* value change call*/
  $("#product-selector").change(function(){
    $(".filter-part").html($("#product-selector").val());
    ajaxCall();
  });

  function ajaxCall() {
    $.ajax({
      type: "GET",
      url: "../../data/regional/charts/"+$("#product-selector").val()+".json",
      dataType: "text",
      success: function(data) {processData(data);}
    });
  }

  function processData(data) {

    var jsonresponce = JSON.parse(data);
    for(var i=0; i<jsonresponce.length; i++) {
      renderChart(jsonresponce[i], i);
    }
  }

  function renderChart(jsondata, number) {

    jsonData = jsondata.data;
    category = jsondata.categories;

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
      if(isEn > 1) {
        ticks.push(entry['Label_en']);
      } else {
        ticks.push(entry['Label']);
      }
    });

    /* graph x Axis length*/
    var largest = Math.max.apply(Math, dataSlices);
    var xAxiTicks = [0, largest+(largest/5)];

    legendTable('legend'+(number+1),category);
    var chartTitle = (isEn > 1) ? jsondata.title_en : jsondata.title;
    plotGraph('chart'+(number+1), dataSlices, colors, chartTitle, ticks, jsonData, xAxiTicks);
  }

  function orderData(prop) {
    return function(a,b) {
      if ( a[prop]*1 > b[prop]*1){
          return 1;
      } else if( a[prop]*1 < b[prop]*1 ){
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
      if (isEn > 1) {
        cell2.innerHTML = data[i].cat_en;
      } else {
        cell2.innerHTML = data[i].cat;
      }
    }
  }

  function plotGraph(chart,slices,colorsData,title,ticksData,jsonDatas, xticks) {
    function tickFormatter(format, val) {
      for(var i=0;i<jsonDatas.length; i++){
        if(jsonDatas[i].Value === val){
          if (isEn > 1) {
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
              ticks: xticks,
              showTicks: false
            },
            yaxis: {
              renderer: $.jqplot.CategoryAxisRenderer,
              ticks: ticksData
            }
          }
      });
  }
});
