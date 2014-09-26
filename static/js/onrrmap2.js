  //Mapbox map contols

  var mapdataviz = L.mapbox.map('map', 'mhertzfeld.i8l68af5')
    .setView([37.8, -91], 4);

  var popup = new L.Popup({ autoPan: false });

  // statesData comes from the 'revenue2013.json' included above
  var statesLayer_oil = L.geoJson(statesData,  {
      style: getStyle_oil,
      onEachFeature: onEachFeature_oil
  }).addTo(mapdataviz);

  var statesLayer_gas = L.geoJson(statesData, {
    style: getStyle_gas,
    onEachFeature: onEachFeature_gas
  }).addTo(mapdataviz);

  var statesLayer_coal;
  var statesLayer_other;
  var statesLayer_geo;

  // var GOMLayer = L.geoJson(GOMNAD_dissolve,  {
  //     style: getStyle,
  //     onEachFeature: onEachFeature
  // }).addTo(mapdataviz);

  function getStyle_oil(feature) {
      return {
          weight: 2,
          opacity: 0.1,
          color: 'black',
          fillOpacity: 0.7,
          fillColor: getColor( (function(){try {return feature.properties.commodities.oil.revenue} catch(err){return 0} })()) 
      };
  }
  function onEachFeature_oil(feature, layer) {
      layer.on({
          mousemove: mousemove_oil,
          mouseout: mouseout,
          click: zoomToFeature
      });
  }
  function mousemove_oil(e) {
      var layer = e.target;
      popup.setLatLng(e.latlng);
      popup.setContent('<h1>' + layer.feature.properties.name + '</h1>' + 
          '<div> Oil Revenue: $' + layer.feature.properties.commodities.oil.revenue.formatMoney(2,'.',',') +'</div>') ;

      if (!popup._map) popup.openOn(mapdataviz);
      window.clearTimeout(closeTooltip);

      // highlight feature
      layer.setStyle({
          weight: 3,
          opacity: 0.3,
          fillOpacity: 0.9
      });

      if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  }
  function getStyle_gas(feature) {
      return {
          weight: 2,
          opacity: 0.1,
          color: 'black',
          fillOpacity: 0.7,
          fillColor: getColor((function(){try {return feature.properties.commodities.gas.revenue} catch(err){return 0} })()) 
      };
  }
  function onEachFeature_gas(feature, layer) {
      layer.on({
          mousemove: mousemove_gas,
          mouseout: mouseout,
          click: zoomToFeature
      });
  }
  function mousemove_gas(e) {
      var layer = e.target;
      popup.setLatLng(e.latlng);
      popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' + 
          '<div> Gas Revenue: $' + layer.feature.properties.commodities.gas.revenue.formatMoney(2,'.',',') +'</div>') ;

      if (!popup._map) popup.openOn(mapdataviz);
      window.clearTimeout(closeTooltip);

      // highlight feature
      layer.setStyle({
          weight: 3,
          opacity: 0.3,
          fillOpacity: 0.9
      });

      if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
      }
  }

  // get color depending on revenue
  function getColor(d) {
      return d > 1000000000 ? '#4b0b07' :
          d > 100000000     ? '#730600' :
          d > 10000000      ? '#a30d05' :
          d > 1000000       ? '#d3352e' :
          d > 100000        ? '#e96b67' :
          d > 10            ? '#db9795' :
          d = 0             ? '#f2d6d5' :
          '#f2d6d5';
  }

  

  var closeTooltip;

  

  function mouseout(e) {
      statesLayer_gas.resetStyle(e.target);
      statesLayer_oil.resetStyle(e.target);
      closeTooltip = window.setTimeout(function() {
          mapdataviz.closePopup();
      }, 100);
  }

  function zoomToFeature(e) {
      mapdataviz.fitBounds(e.target.getBounds());
  }

  mapdataviz.legendControl.addLegend(getLegendHTML());

  function getLegendHTML() {
    var grades = [0, 10, 100000, 1000000, 10000000, 100000000, 1000000000],
    labels = [],
    from, to;

    for (var i = 0; i < grades.length; i++) {
      from = grades[i];
      to = grades[i + 1];

      labels.push(
        '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
        from + (to ? '&ndash;' + to : '+')) + '</li>';
    }

    return '<span>Resource revenues from<br/>Federal lands by state, 2013</span><ul>' + labels.join('') + '</ul>';
  }


  //Create group of layers to display in toggle list
  var overlays = {
      "Oil": statesLayer_oil,
      "Gas": statesLayer_gas
  };

  //Add layer toggler
  L.control.layers(overlays,null, {
      collapsed:false,
    }).addTo(mapdataviz);


