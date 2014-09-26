var mapdataviz = L.mapbox.map('map', 'mhertzfeld.i8l68af5')
    .setView([37.8, -91], 4);

  var popup = new L.Popup({ autoPan: false });

  var hues = [
    '#eff3ff',
    '#bdd7e7',
    '#6baed6',
    '#64A4CB',
    '#3182bd',
    '#2C78AF',
    '#08519c',
    '#05396F'];
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
  ranges[variables[i]] = {min: 0, max: -Infinity};
}
$('#map-comodities-pane div').each(function(i){
  $(this).attr('data-value',variables[i]);
  
  $(this).click(function(){
    setVariable($(this).attr('data-value'));
    
    $('#map-comodities-pane div').each(function(n){
      $(this).attr('class',$(this).attr('class').replace('-selected','').replace(' selected',''));
    });

    $(this).attr('class',$(this).attr('class')+'-selected selected');
  })
});

  // statesData comes from the 'revenue2013.json' included above
  var statesLayer = L.geoJson(statesData, {
    onEachFeature : onEachFeature
  }).addTo(mapdataviz);

  var gomLayer = L.geoJson(GOMNAD_dissolve,{
    onEachFeature: onEachFeature
  }).addTo(mapdataviz);

  var atlanticLayer = L.geoJson(ATLNAD83,{
    onEachFeature: onEachFeature
  }).addTo(mapdataviz);

  var pacificLayer = L.geoJson(PCNAD83,{
    onEachFeature: onEachFeature
  }).addTo(mapdataviz);


  setRange(GOMNAD_dissolve);
  setRange(statesData);
  setRange(ATLNAD83);
  setRange(PCNAD83);

  dataLayers.push(statesLayer);
  dataLayers.push(gomLayer);
  dataLayers.push(atlanticLayer);
  dataLayers.push(pacificLayer);

  setVariable(variables[0])


  function setRange(data){
    for (var i=0; i<data.features.length; i++)
    {
      if (data.features[i].properties.commodities){
        for (var n= 0 ; n<variables.length; n++)
        {
          if (data.features[i].properties.commodities[variables[n]])
            if (ranges[variables[n]].max < data.features[i].properties.commodities[variables[n]].revenue && data.features[i].properties.commodities[variables[n]].revenue < 1000000000.00)
              ranges[variables[n]].max = data.features[i].properties.commodities[variables[n]].revenue
        }
      }
    }
  }

  function setVariable(name) {
    for (var i=0; i<dataLayers.length; i++)
    {
      var scale = ranges[name];
      dataLayers[i].eachLayer(function(layer) {
        var value =0;
        if (layer.feature.properties.commodities)
        {
          if (layer.feature.properties.commodities[name])
          {
            value = layer.feature.properties.commodities[name].revenue;
            //console.log("State=" + layer.feature.properties.name + "Revenue for " + name+ " amount = "+layer.feature.properties.commodities[name].revenue)
          }
            
        }
          

          // Decide the color for each state by finding its
          // place between min & max, and choosing a particular
          // color as index.
          var mathScale =(hues.length - 1) *
              ((value - scale.min) /
              (scale.max - scale.min));
          if (mathScale > 0 && mathScale < 2)
            var division = 1;
          else 
            var division = Math.floor(
              (hues.length - 1) *
              ((value - scale.min) /
              (scale.max - scale.min)));

          console.log(layer.feature.properties.name + " divions = "+  (hues.length - 1) *
              ((value - scale.min) /
              (scale.max - scale.min)))
          if (division < 0)
            division = 0;
          // See full path options at
          // http://leafletjs.com/reference.html#path
          var newColor = hues[division];
          if (value > 1000000000.00)
            newColor = '#243649';
          layer.setStyle({
              fillColor: newColor,
              fillOpacity: 0.8,
              weight: 0.5
          });
      });
    }
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
        var selected = $('#map-comodities-pane div.selected').attr('data-value');
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
            returnString +="<aside><strong>Active leases</strong> are pieces of federal land that are currently producing a commodity.</br>"+
                            "<strong>Total leases</strong> include both active leases and leases that have been sold, but are not producing any commodities.</aside>";
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


