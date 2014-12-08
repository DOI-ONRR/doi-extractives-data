$(document).ready(function(){
  var map_draw_init = false;
  var statesDrawOrder = ["Alabama","Alaska","Arizona", "Arkansas", "Connecticut", "Delaware","District of Columbia",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
    "Oregon","New Hampshire", "New Jersey", "New York","North Carolina", "North Dakota","Ohio", "Oklahoma",
    "Pennsylvania", "Rhode Island","South Carolina","South Dakota","Tennessee", "Texas", "Vermont", "Virginia",
    "Washington", "West Virginia", "Wisconsin", "Wyoming","Utah","Nevada", "California", "Colorado","New Mexico"];
  var atlanticDrawOrder = [ 'North Atlantic','Mid-Atlantic' ,'South Atlantic','Straights of Florida' ];
  var gomDrawOrder = ['Eastern Gulf of Mexico','Central Gulf of Mexico','Western Gulf of Mexico']
  var mapdataviz;//Holds map object
  var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));//Boolean for mobile screen widths

  //List of commodities on map
  var variables = [
      'oil',
      'gas',
      'coal',
      'other',
      'wind',
      'geothermal'];
  //Empty Object to hold revenue range info
  var ranges ={};
  //Empty Object used to 3d layers
  var dataLayers=[];
  //Default selected commodity
  var selectedCommodity = 'oil';

  // these fixed color classes are from ColorBrewer: http://colorbrewer2.org/
  var mapColors = ['rgb(254,224,210)','rgb(252,187,161)','rgb(252,146,114)','rgb(251,106,74)','rgb(239,59,44)','rgb(203,24,29)','rgb(165,15,21)','rgb(103,0,13)'];


  /*
   * This is a quantized color, meaning that it will always return
   * one of the colors in mapColors[]. Usage:
   *
   * mapColorScale.domain([min, max]);
   * var color = mapColorScale(value);
   */
  var mapColorScale = d3.scale.quantize()
    .domain([0, 100])
    .range(mapColors);
  //mapColorScale_limited cuts off the last color
  //This color is reserved for the top commodity only
  //This gives the rest of the colors a better scale
  var mapColorScale_limited = d3.scale.quantize()
    .domain([0, 100])
    .range(mapColors.slice(0,mapColors.length-1));

  // Create one div.step for each map color, and insert them
  // into #map-scale-pane > .map-scale
  var mapScaleSteps = d3.select("#map-scale-pane .map-scale")
    .selectAll("div.step")
    .data(mapColors)
    .enter()
    .append("div")
      .attr("class", "step")
      .style("background", function(d) { return d; })
      .style("width", (100 / mapColors.length).toFixed(3) + "%");
  // (their width is 100% / the number of colors)

  // dollar formatting (for color step HTML titles)
  var commaFormat = d3.format(",");
  var dollarFormat = function(dollars) {
    return "$" + commaFormat(Math.floor(dollars));
  };

  //Initilize Map
  (function(){
    if (mobile)
    {
      mapdataviz = L.map('map', {
        scrollWheelZoom: false
        }).setView([41.5, -99.5795], 3);
    }
    else
    {
      mapdataviz = L.map('map', {
        scrollWheelZoom: false
      }).setView([41.5, -99.5795], 4);
    }
    mapdataviz.on('zoomstart',function(){
      $('g[id*="map_stack_sector"]').each(function(){
          
          $(this).remove();
      });
    });
    mapdataviz.on('zoomend',function(){
      var zoomTimeout = setInterval(function(){
        calculateHeights();
        clearTimeout(zoomTimeout);
      },1000);
    });
  })();


  //Set Title layer, Text at bottom of map
  L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Tiles Courtesy of <a href="https://www.mapquest.com/" target="_blank">MapQuest</a>',
      maxZoom: 18,
      subdomains: [1, 2, 3, 4]
    }).addTo(mapdataviz);

  mapdataviz.scrollWheelZoom.disable();
  var popup = new L.Popup({ autoPan: false });

  
  //Set Ranges for various commodities
  (function(){
    for (var i = 0; i<variables.length; i++)
    {
      ranges[variables[i]] = {min: Infinity, max: -Infinity, trueMax: -Infinity};
    }
  })();
  
  //Sets up Commodites switch pane
  $('#map-comodities-pane>a').each(function(i){
    $(this).attr('data-value',variables[i]);

    $(this).click(function(){
      selectedCommodity = $(this).attr('data-value');
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
  });

    // statesData comes from the 'revenue2013.json' included above
    statesData = sortGeoJson(statesData,statesDrawOrder);
    var statesLayer, gomLayer, atlanticLayer, pacificLayer, AKLayer;
    //Sets Data layers
    (function(){
      if (!mobile)
      {
        statesLayer = L.geoJson(statesData, {
        onEachFeature : onEachFeature
        }).addTo(mapdataviz);

        GOM_NAD27_simp = sortGeoJson(GOM_NAD27_simp, gomDrawOrder);
        gomLayer = L.geoJson(GOM_NAD27_simp,{
          onEachFeature: onEachFeature
        }).addTo(mapdataviz);

        ATL_NAD83_simp = sortGeoJson(ATL_NAD83_simp ,atlanticDrawOrder);
        atlanticLayer = L.geoJson(ATL_NAD83_simp,{
          onEachFeature: onEachFeature
        }).addTo(mapdataviz);

        pacificLayer = L.geoJson(PC_NAD83_simp,{
          onEachFeature: onEachFeature
        }).addTo(mapdataviz);

        AKLayer = L.geoJson(AK_NAD83_simp,{
          onEachFeature: onEachFeature
        }).addTo(mapdataviz);
      }
      else
      {
        statesLayer = L.geoJson(statesData, {
        onEachFeature : onEachFeatureMobile
        }).addTo(mapdataviz);

        GOM_NAD27_simp = sortGeoJson(GOM_NAD27_simp, gomDrawOrder);
        gomLayer = L.geoJson(GOM_NAD27_simp,{
          onEachFeature: onEachFeatureMobile
        }).addTo(mapdataviz);

        ATL_NAD83_simp = sortGeoJson(ATL_NAD83_simp ,atlanticDrawOrder);
        atlanticLayer = L.geoJson(ATL_NAD83_simp,{
          onEachFeature: onEachFeatureMobile
        }).addTo(mapdataviz);

        pacificLayer = L.geoJson(PC_NAD83_simp,{
          onEachFeature: onEachFeatureMobile
        }).addTo(mapdataviz);

        AKLayer = L.geoJson(AK_NAD83_simp,{
          onEachFeature: onEachFeatureMobile
        }).addTo(mapdataviz);
      }
    })();//End Function
    
    


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

    setVariable(selectedCommodity)

    function loadGeoJson(data, map)
    {
      if (!mobile)
      {
        return  L.geoJson(data, {
          onEachFeature: onEachFeature
        }).addTo(map);  
      }
      else
      {
        return  L.geoJson(data, {
          onEachFeature: onEachFeatureMobile
        }).addTo(map);
      }
      
    }
    function setRange(data){
      for (var i=0; i<data.features.length; i++)
      {
        if (data.features[i].properties.commodities){
          for (var n = 0 ; n<variables.length; n++)
          {
            if (data.features[i].properties.commodities[variables[n]])
            {
              var value = data.features[i].properties.commodities[variables[n]].revenue;
              if (ranges[variables[n]].max < value )
                {
                  /*
                   * If value is greater than true max, set max to true max, set new true max
                   * else set new max
                  */
                  if(ranges[variables[n]].trueMax < value)
                    {
                      if (ranges[variables[n]].trueMax == -Infinity)
                      {
                        ranges[variables[n]].max = value;
                        ranges[variables[n]].trueMax = value;   
                      }
                      else
                      {
                        ranges[variables[n]].max = ranges[variables[n]].trueMax;
                        ranges[variables[n]].trueMax = value; 
                      }
                    }
                  else
                    ranges[variables[n]].max = value;
                }
              if (ranges[variables[n]].min > value)
                {
                  ranges[variables[n]].min = value;
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
      var range = ranges[name];
      $('div.map-scale-min').html('$' + Math.floor(range.min).formatMoney(0,'.',','));
      $('div.map-scale-max').html('$' + range.trueMax.formatMoney(0,'.',','));
      $('#map-scale-pane > h1').html(selectedCommodity == 'wind' ? 'Revenues' : 'Royalties');

      // update the (input) domain of the color scale,
      // according to the new variable's range, affecting
      // subsequent calls to mapColorScale(value)
      mapColorScale.domain([range.min, range.max]);
      mapColorScale_limited.domain([range.min,range.max]);

      for (var i = 0; i < dataLayers.length; i++)
      {
        dataLayers[i].eachLayer(function(layer) {
          setLayerColor(layer);
        });
      }
      /**********************
      *If the map has been initilized
      *Draw the heights
      ***********************/
      if (map_draw_init)
        calculateHeights();

      // update the map scale each time the variable changes
      updateMapScale();
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mousemove: mousemove,
        mouseout: mouseout,
        click: zoomToFeature
      });
    }

    function onEachFeatureMobile(feature, layer) {
      layer.on({
        click: mousemove
      });
    }

    var closeTooltip;
    var lastAreaViewed = false;
    function mousemove(e) {
        if(!map_draw_init)
        {
          map_draw_init = true;
          calculateHeights();
        }
        if (mobile)
        {
          if (lastAreaViewed)
            mouseout(lastAreaViewed);
          lastAreaViewed = e;
        }
        var layer = e.target;
        //setStrokeWeight(layer,'3.0');
        setFillColor(layer,'#D8D8D8')
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
          var roy_rev = revenueType == 'Wind' ? ' Revenues' : ' Royalties';
          var returnString ="<div>"+revenueType+roy_rev+":<br />$"+revenueAmt.formatMoney(2,'.',',')+"</div>";
          if (selected == 'oil' || selected == 'gas')
          {
            if (layer.feature.properties.leases)
            {
              returnString +="<div>Producing Leases: "+layer.feature.properties.leases.active+"</div>";
              returnString +="<div>Non-producing Leases: "+ layer.feature.properties.leases.total+"</div>";
              returnString +="<aside><p><strong>Producing leases</strong> are leased Federal lands that are producing one or more commodities.</p>"+
                              "<p><strong>Non-producing leases</strong> are Federal lands that have been leased for exploration and development, but are not producing any commodities.</p></aside>";
            }
          }
          return returnString;
        })();

        //$('#map-info-pane').html('<h1>'+layer.feature.properties.name + '<span></span></h1>' + Revenue_String).show();
        $('#map-info-pane > h1').html(function(){
            return mobile ? layer.feature.properties.name + "<span>▲</span>" : layer.feature.properties.name + "<span></span>" 
          }
        );
        $('#map-info-pane > div').html(Revenue_String);
        $('#map-info-pane').show();
    }

    function mouseout(e) {
        statesLayer.resetStyle(e.target);
        var layer = e.target;
        //setStrokeWeight(layer,'0.5')
        setLayerColor(layer);
        closeTooltip = window.setTimeout(function() {
            mapdataviz.closePopup();
        }, 100);
        $('#map-info-pane').hide();
    }

    function zoomToFeature(e) {
        //mapdataviz.fitBounds(e.target.getBounds());
    }


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
        var depth = getMapColorDepth(layerColor);
        $(this).attr('data-3d-layers','heightIdentifier'+index);
        $(this).attr('data-fill-color' , $(this).attr('fill'));
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
          {
            //console.log('Sort Geo JSON ERROR Not Found - '+geoJsonArray[i].properties.name);
          }
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
          if (isScrolledIntoView('#map')) {
              map_draw_init = true;
              calculateHeights();
          }
      });
    (function(){
      if (isScrolledIntoView('#map')) {
              map_draw_init = true;
              calculateHeights();
      }
    })();

  /********************************************************************************************
  *Via: http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
  *********************************************************************************************/
  function isScrolledIntoView(elem)
  {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();

      var elemTop = $(elem).offset().top;
      var elemBottom = elemTop + $(elem).height();
      if ($(elem).offset().top < $(window).scrollTop() + 10)
        return true;
      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  function setStrokeWeight(layer,weight){
    // layer.setStyle({
    //   weight: 3.0
    // });
    $("g[data-3d-layers='"+$(layer._container).attr('data-3d-layers')+"'] path").each(function(){
        $(this).attr('stroke-width',weight);
      });
  }
  function setFillColor(layer,color){
    //console.log(layer);
    if (layer.hasOwnProperty('_layers'))
    {
      for(var key in layer._layers)
      {
        $("g[data-3d-layers='"+$(layer._layers[key]._container).attr('data-3d-layers')+"'] path").each(function(){
          $(this).attr('fill-opacity',1.0);
          $(this).attr('fill',color);
        });
      }
    }
    else
    {
      $("g[data-3d-layers='"+$(layer._container).attr('data-3d-layers')+"'] path").each(function(){
        $(this).attr('fill-opacity',1.0);
        $(this).attr('fill',color);
      });
    }
  }

  function setLayerColor(layer){
    var value = 0;
    var name = selectedCommodity;
    var max = mapColorScale.domain()[1];
    if (layer.feature.properties.commodities)
    {
      if (layer.feature.properties.commodities[name])
      {
        value = layer.feature.properties.commodities[name].revenue;
      }

    }
    var newColor;
    if (value < 0)
      {
        newColor = mapColorScale(1);
      }
    else if (value > max)  
      newColor = mapColorScale(value);
    else 
      newColor=mapColorScale_limited(value);//use limited scale to avoid top color
    $("g[data-3d-layers='"+$(layer._container).attr('data-3d-layers')+"'] path").each(function(){
      $(this).attr('fill', newColor);
    });

    var opacity = (value != 0) ? 1 : 0;
    layer.setStyle({
      fillColor: newColor,
      fillOpacity: opacity,
      weight: 0.5,
      data_revenue: value
    });
  }

  /*
   * Update the map scale by setting the title attribute of each of
   * the color steps.
   */
  function updateMapScale() {
    mapScaleSteps
      .attr("title", function(color, i) {
        var extent = mapColorScale.invertExtent(color);
        return extent.map(dollarFormat).join(" - ");
      });
  }

  // get the 3D "depth" for a given map color
  function getMapColorDepth(color) {
    return Math.max(mapColors.indexOf(color), 0);
  }

}); // End document ready


$(document).ready(function(){
  var mobile = $(document).width() <= 550;
  if (mobile)
  {
     var pane = $('#map-info-pane');
     pane.addClass('map-info-pane-minimized');
     $("#map-info-pane > div").css('display','none');
     pane.click(function(e){
      $content = $("#map-info-pane > div");
      $content.slideToggle(500, function(){
        $('#map-info-pane > h1 > span').text(function(){
          return $content.is(":visible") ? "▼":"▲"; 
        })  
      });
     })
  }
});




