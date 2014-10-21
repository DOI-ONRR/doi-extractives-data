// var mapdataviz = L.mapbox.map('map', 'mhertzfeld.i8l68af5')
//     .setView([37.8, -91], 4);
var map_draw_init = false;
var statesDrawOrder = ["Alabama","Alaska","Arizona", "Arkansas", "Connecticut", "Delaware","District of Columbia", 
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", 
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", 
  "Oregon","New Hampshire", "New Jersey", "New York","North Carolina", "North Dakota","Ohio", "Oklahoma", 
  "Pennsylvania", "Rhode Island","South Carolina","South Dakota","Tennessee", "Texas", "Vermont", "Virginia", 
  "Washington", "West Virginia", "Wisconsin", "Wyoming","Utah","Nevada", "California", "Colorado","New Mexico"];
var atlanticDrawOrder = [ 'North Atlantic','Mid-Atlantic' ,'South Atlantic','Straights of Florida' ];
var gomDrawOrder = ['Eastern Gulf of Mexico','Central Gulf of Mexico','Western Gulf of Mexico']


var mapdataviz = L.map('map', {
    scrollWheelZoom: false
  }).setView([37.9282, -99.5795], 4);
L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a>',
    maxZoom: 18,
    subdomains: [1, 2, 3, 4]
  }).addTo(mapdataviz);

mapdataviz.scrollWheelZoom.disable();
  var popup = new L.Popup({ autoPan: false });

  var hues = [
    '#efaeab',
    '#7e3533'
    // '#EFF3FF',
    // '#243649'
  ];
var variables = [
    'oil',
    'gas',
    'coal',
    'other',
    'wind',
    'geothermal'];

var ranges ={};
var dataLayers=[];

for (var i = 0; i<variables.length; i++)
{
  ranges[variables[i]] = {min: Infinity, max: -Infinity};
}
$('#map-comodities-pane>a').each(function(i){
  $(this).attr('data-value',variables[i]);
  
  $(this).click(function(){
    setVariable($(this).attr('data-value'));
    $('#map-comodities-pane a').each(function(n){
      $(this).attr('aria-pressed','false');
    });

    $(this).attr('aria-pressed','true');
  })


  $('h1',this).mousemove(function(){
   $(this).siblings('div').show();
  });
  $('h1',this).mouseout(function(){
   $(this).siblings('div').hide();
  });


  // $(this).mousemove(function(){
  //   $('div',this).show();
  // });
  // $(this).mouseout(function(){
  //   $('div',this).hide();
  // });
});

  // statesData comes from the 'revenue2013.json' included above
  statesData = sortGeoJson(statesData,statesDrawOrder);
  var statesLayer = L.geoJson(statesData, {
    onEachFeature : onEachFeature
  }).addTo(mapdataviz);

  GOM_NAD27_simp = sortGeoJson(GOM_NAD27_simp, gomDrawOrder);
  var gomLayer = L.geoJson(GOM_NAD27_simp,{
    onEachFeature: onEachFeature
  }).addTo(mapdataviz);

  ATL_NAD83_simp = sortGeoJson(ATL_NAD83_simp ,atlanticDrawOrder);
  var atlanticLayer = L.geoJson(ATL_NAD83_simp,{
    onEachFeature: onEachFeature
  }).addTo(mapdataviz);

  var pacificLayer = L.geoJson(PC_NAD83_simp,{
    onEachFeature: onEachFeature
  }).addTo(mapdataviz);

  var AKLayer = L.geoJson(AK_NAD83_simp,{
    onEachFeature: onEachFeature
  }).addTo(mapdataviz);


  setRange(GOM_NAD27_simp);
  setRange(statesData);
  setRange(ATL_NAD83_simp);
  setRange(PC_NAD83_simp);
  setRange(AK_NAD83_simp);


  dataLayers.push(statesLayer);
  dataLayers.push(gomLayer);
  dataLayers.push(atlanticLayer);
  dataLayers.push(pacificLayer);
  dataLayers.push(AKLayer);

  setVariable(variables[0])

  function loadGeoJson(data, map)
  {
    return  L.geoJson(data, {
      onEachFeature: onEachFeature
    }).addTo(map);
  }
  function setRange(data){
    for (var i=0; i<data.features.length; i++)
    {
      if (data.features[i].properties.commodities){
        for (var n= 0 ; n<variables.length; n++)
        {
          if (data.features[i].properties.commodities[variables[n]])
          {
            if (ranges[variables[n]].max < data.features[i].properties.commodities[variables[n]].revenue && data.features[i].properties.commodities[variables[n]].revenue < 100000000000000.00)
              ranges[variables[n]].max = data.features[i].properties.commodities[variables[n]].revenue
            if (ranges[variables[n]].min > data.features[i].properties.commodities[variables[n]].revenue && data.features[i].properties.commodities[variables[n]].revenue > 1000.00)
              {
                ranges[variables[n]].min = data.features[i].properties.commodities[variables[n]].revenue
              }
              
          }
            
        }
      }
    }
  }
  /**********************************
  function: setVariable
  This function loops through the layers
  and assigns new colors to each layer
  based on the value of the currently 
  selected commodity. 
  This function then calls calculateHeights
  to draw the 3d effect.
  ***********************************/
  function setVariable(name) {
    $('div.map-scale-min').html('$'+ranges[name].min.formatMoney(0,'.',','));
    $('div.map-scale-max').html('$'+ranges[name].max.formatMoney(0,'.',','));
    for (var i=0; i<dataLayers.length; i++)
    {
      var scale = ranges[name];
      dataLayers[i].eachLayer(function(layer) {
        var value =0;
        //console.log('layers=');
        //console.log(layer);
        if (layer.feature.properties.commodities)
        {
          if (layer.feature.properties.commodities[name])
          {
            value = layer.feature.properties.commodities[name].revenue;
            //console.log("State=" + layer.feature.properties.name + "Revenue for " + name+ " amount = "+layer.feature.properties.commodities[name].revenue)
          }
            
        }
          

          
          var percent = (value / scale.max) * 100;
          var newColor = makeGradientColor(hues[0],hues[1],percent);
        
          if (percent == 0)
          {
            layer.setStyle({
              fillColor: newColor.cssColor,
              fillOpacity: 0.0,
              weight: 0.5,
              data_revenue: value
            })
          }
          else
          {
            layer.setStyle({
              fillColor: newColor.cssColor,
              fillOpacity: 1.0,
              weight: 0.5,
              data_revenue: value
            });
          }
          

          
      });
    }
    if (map_draw_init)
      calculateHeights();
  }

  // function loadData(){
  //   $.getJSON('/static/data/revenue2013.geojson')
  //       .done(function(data){
  //         joinData(data,statesLayer);
  //       });
  // }
  // function joinData(data,layer){
  //   var usGeoJSON = statesLayer.toGeoJSON(),
  //       byState = {};

  //       for (var i= 0; i<usGeoJSON.features.length; i++){
  //         byState[usGeoJSON.features[i].properties.name] = 
  //           usGeoJSON.features[i];
  //       }
  //       for (i = 0; i < data.length; i++) {
  //         // Match the GeoJSON data (byState) with the tabular data
  //         // (data), replacing the GeoJSON feature properties
  //         // with the full data.
  //         byState[data[i].name].properties = data[i];
  //         for (var j = 0; j < variables.length; j++) {
  //                 // Simultaneously build the table of min and max
  //                 // values for each attribute.
  //                 var n = variables[j];
  //                 ranges[n].min = Math.min(data[i][n], ranges[n].min);
  //                 ranges[n].max = Math.max(data[i][n], ranges[n].max);
  //         }
  //       }
  //   // Create a new GeoJSON array of features and set it
  //   // as the new usLayer content.
  //   var newFeatures = [];
  //   for (i in byState) {
  //       newFeatures.push(byState[i]);
  //   }
  //   usLayer.setGeoJSON(newFeatures);
  //   // Kick off by filtering on an attribute.
  //   setVariable(variables[0]);


  // }


  // var statesLayer = L.geoJson(statesData,  {
  //     style: getStyle,
  //     onEachFeature: onEachFeature
  // }).addTo(mapdataviz);

  // var GOMLayer = L.geoJson(GOMNAD_dissolve,  {
  //     style: getStyle,
  //     onEachFeature: onEachFeature
  // }).addTo(mapdataviz);

  // function getStyle(feature) {
  //     return {
  //         weight: 2,
  //         opacity: 0.1,
  //         color: 'black',
  //         fillOpacity: 0.7,
  //         fillColor: getColor(feature.properties.revenue)
  //     };
  // }

  // // get color depending on revenue
  // function getColor(d) {
  //     return d > 1000000000 ? '#4b0b07' :
  //         d > 100000000  ? '#730600' :
  //         d > 10000000  ? '#a30d05' :
  //         d > 1000000   ? '#d3352e' :
  //         d > 100000   ? '#e96b67' :
  //         d > 10   ? '#db9795' :
  //         d = 0   ? '#f2d6d5' :
  //         '#f2d6d5';
  // }

  function onEachFeature(feature, layer) {
      layer.on({
          mousemove: mousemove,
          mouseout: mouseout,
          click: zoomToFeature
      });
  }

  var closeTooltip;

  function mousemove(e) {
      var layer = e.target;

      var Revenue_String = (function(){
        var selected; 
        $('#map-comodities-pane a').each(function(){
          if ($(this).attr('aria-pressed')=='true')
            selected = $(this).attr('data-value');
        });
        if (layer.feature.properties.commodities)
        {
          if (layer.feature.properties.commodities[selected])
            var revenueAmt = layer.feature.properties.commodities[selected].revenue;
          else 
            var revenueAmt = 0.0;
        }
        else 
        {
          var revenueAmt = 0.0;
        }
        var revenueType = selected.capitalize();
        var returnString ="<div>"+revenueType+" Revenue:<br />$"+revenueAmt.formatMoney(2,'.',',')+"</div>";
        if (selected == 'oil' || selected == 'gas')
        {
          if (layer.feature.properties.leases)
          {
            returnString +="<div>Active Leases: "+layer.feature.properties.leases.active+"</div>";
            returnString +="<div>Total Leases: "+ layer.feature.properties.leases.total+"</div>";
            returnString +="<aside><p><strong>Active leases</strong> are leased federal lands that are producing one or more commodities.</p>"+
                            "<p><strong>Total leases</strong> include both active leases and leases that have been sold, but are not producing any commodities.</p></aside>";
          }
        }
        return returnString;
      })();

      $('#map-info-pane').html('<h1>'+layer.feature.properties.name + '</h1>' + Revenue_String).show();
      //popup.setLatLng(e.latlng);
      //popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' + Revenue_String);

      // if (!popup._map) popup.openOn(mapdataviz);
      // window.clearTimeout(closeTooltip);

      // // highlight feature
      // // layer.setStyle({
      // //     weight: 3,
      // //     opacity: 0.3,
      // //     fillOpacity: 0.9
      // // });

      // if (!L.Browser.ie && !L.Browser.opera) {
      //     layer.bringToFront();
      // }
  }

  function mouseout(e) {
      statesLayer.resetStyle(e.target);
      closeTooltip = window.setTimeout(function() {
          mapdataviz.closePopup();
      }, 100);
      $('#map-info-pane').hide();
  }

  function zoomToFeature(e) {
      mapdataviz.fitBounds(e.target.getBounds());
      $('g[id*="map_stack_sector"]').each(function(){
        $(this).remove(); 
      });
      var timeout = setInterval(function(){
        calculateHeights();
        clearTimeout(timeout);
      },1000);
  }

  // mapdataviz.legendControl.addLegend(getLegendHTML());

  // function getLegendHTML() {
  //   var grades = [0, 10, 100000, 1000000, 10000000, 100000000, 1000000000],
  //   labels = [],
  //   from, to;

  //   for (var i = 0; i < grades.length; i++) {
  //     from = grades[i];
  //     to = grades[i + 1];

  //     labels.push(
  //       '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
  //       from + (to ? '&ndash;' + to : '+')) + '</li>';
  //   }

  //   return '<span>Resource revenues from<br/>Federal lands by state, 2013</span><ul>' + labels.join('') + '</ul>';
  // }


  //Create group of layers to display in toggle list
  // var overlays = {
  //     "2013": statesLayer,
  //     "2012": statesData
  // };

  //Add layer toggler
  // L.control.layers(null,overlays, {
  //     collapsed:false,
  //   }).addTo(mapdataviz);
  

  /*******************************
  function: calculateHeights
  Looks at the map and based on color, 
  draws repeated shapes at an angle to 
  create a 3d effect.
  The new shapes have css set to allow
  mouse events to pass through
  *********************************/
  function calculateHeights(){
    $('g[id*="map_stack_sector"]').each(function(){
      $(this).remove(); 
    });
    var count = 0;
    var idCount=0;
    var maxDepth = 15;
    var overlayLayer = $('svg.leaflet-zoom-animated');
    var snap = Snap('svg.leaflet-zoom-animated');

    $('g',overlayLayer).each(function(index){

      var layerColor = $('path',$(this)).attr('fill');
      var depth = Math.round(getColorPercent(layerColor,hues[1],hues[0]) * maxDepth);
      while(count < depth && $('path', $(this)).attr('fill-opacity') > 0)
      {
        $(this).clone()
        .appendTo($(this).parent())
        .attr('id','map_stack_sector'+idCount)
        .css('pointer-events','none');
        var snapSelect = snap.select('#map_stack_sector'+idCount);
        snapSelect.animate({transform: 't'+count+',' + -count},300);
        count++;
        idCount++;
      }
      count = 0;
    });
  }
  
  /**************************************
  Sets function on the zoom control for the map
  Clears the 3d sections, then redraws after a second delay
  which gives the map enough time to reset
  ***************************************/
  $('.leaflet-control-zoom-in, .leaflet-control-zoom-out').click(function(){
    $('g[id*="map_stack_sector"]').each(function(){
      $(this).remove(); 
    });
    var timeout = setInterval(function(){
      calculateHeights();
      clearTimeout(timeout);
    },1000);
  })












  /****************************
  Function: sortGeoJson
  Takes a geoJson and sorts based on
  an array which matches the name properties in the geoJson
  *****************************/
  function sortGeoJson(geoJson, drawOrder){
    var geoJsonArray = geoJson.features;
    var newArray=[];
    for(var i=0; i<geoJsonArray.length; i++)
    {
      if (drawOrder.indexOf(geoJsonArray[i].properties.name) == -1)
        console.log('Sort Geo JSON ERROR Not Found - '+geoJsonArray[i].properties.name);
      newArray[drawOrder.indexOf(geoJsonArray[i].properties.name)] = geoJsonArray[i];
    }
    geoJson.features = newArray;
    return geoJson;
  }


  /******************************
  Functionality: Draw map height
  on scroll
  *******************************/
  $(window).scroll(function (event) {
        if (map_draw_init)
          return;
        if ($("#fourth1").offset().top < $(window).scrollTop() + 150) {
            map_draw_init = true;
            calculateHeights();
        }
    });
  
  
