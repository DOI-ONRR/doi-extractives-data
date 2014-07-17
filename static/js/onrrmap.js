  //Mapbox map contols

  var mapdataviz = L.mapbox.map('map', 'mhertzfeld.i8l68af5')
    .setView([37.8, -91], 4);

  var popup = new L.Popup({ autoPan: false });

  // statesData comes from the 'revenue2013.json' included above
  var statesLayer = L.geoJson(statesData,  {
      style: getStyle,
      onEachFeature: onEachFeature
  }).addTo(mapdataviz);

  function getStyle(feature) {
      return {
          weight: 2,
          opacity: 0.1,
          color: 'black',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.revenue)
      };
  }

  // get color depending on revenue
  function getColor(d) {
      return d > 1000000000 ? '#4b0b07' :
          d > 100000000  ? '#730600' :
          d > 10000000  ? '#a30d05' :
          d > 1000000   ? '#d3352e' :
          d > 100000   ? '#e96b67' :
          d > 10   ? '#db9795' :
          d = 0   ? '#f2d6d5' :
          '#f2d6d5';
  }

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

      popup.setLatLng(e.latlng);
      popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' + 
          '<div>Revenue earned in 2013</div>' + layer.feature.properties.revenueTitle );

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

  function mouseout(e) {
      statesLayer.resetStyle(e.target);
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
      "2013": statesLayer,
      "2012": statesData
  };

  //Add layer toggler
  L.control.layers(null,overlays, {
      collapsed:false,
    }).addTo(mapdataviz);


