$(document).ready(function() {

  // ensure that polygons get drawn even when they're not visible
  L.Polygon.CLIP_PADDING = 1;

  var map_draw_init = false;

  /*
   * This is the order in which states should be drawn, which matters because
   * of the "3D" effect. Generally, the states should be ordered from top right
   * (northeast) to bottom left (southwest), but there are some edge cases.
   */
  var statesDrawOrder = [
    "Maine", "Vermont", "New Hampshire", "Massachusetts", "Rhode Island", "Connecticut", "New York",
    "New Jersey", "Pennsylvania", "Delaware", "Maryland",
    "Michigan", "Ohio",
    "West Virginia", "Virginia",
    "South Dakota",
    "Nebraska",
    "Minnesota", "Wisconsin", "North Dakota", "Montana",
    "Wyoming", "Idaho", "Washington", "Oregon",
    "Alabama", "Alaska", "Arkansas", "District of Columbia", "Florida",
    "Georgia", "Hawaii", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Mississippi", "Missouri", "North Carolina", "Oklahoma", "South Carolina", "Tennessee",
    "Texas", "Colorado", "Utah", "New Mexico", "Arizona", "Nevada", "California"
  ];

  var atlanticDrawOrder = ["North Atlantic", "Mid-Atlantic", "South Atlantic", "Straights of Florida"];
  var gomDrawOrder = ["Eastern Gulf of Mexico", "Central Gulf of Mexico", "Western Gulf of Mexico"];

  var mapdataviz; // the L.Map instance

  // Boolean for mobile screen widths FIXME: use feature detection?
  var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  // List of commodities on map
  var variables = [
    "oil",
    "gas",
    "coal",
    "other",
    "wind",
    "geothermal"
  ];

  // Empty Object to hold revenue range info
  var ranges = {};
  // Empty Object used to 3d layers
  var dataLayers = [];
  // Default selected commodity
  var selectedCommodity = 'oil';

  // these fixed color classes are from ColorBrewer: http://colorbrewer2.org/
  var mapColors = ['rgb(255,247,243)','rgb(253,224,221)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(221,52,151)','rgb(174,1,126)','rgb(122,1,119)']; // ,'rgb(73,0,106)']

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
    .range(mapColors.slice(0, mapColors.length - 1));

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

  var redrawTimeout;

  var mapdataviz = L.map('map', {
      scrollWheelZoom: false
    })
    .setView([41.5, -99.5795], mobile ? 3 : 4)
    .on('zoomstart',function() {
      hideHeights();
    })
    .on('zoomend',function() {
      clearTimeout(redrawTimeout);
      redrawTimeout = setTimeout(redrawHeights, 10);
    });


  //Set Title layer, Text at bottom of map
  L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Tiles Courtesy of <a href="https://www.mapquest.com/" target="_blank">MapQuest</a>',
      maxZoom: 18,
      subdomains: [1, 2, 3, 4]
    })
    .addTo(mapdataviz);

  mapdataviz.scrollWheelZoom.disable();

  var popup = new L.Popup({ autoPan: false });

  //Set Ranges for various commodities
  (function() {
    for (var i = 0; i < variables.length; i++) {
      ranges[variables[i]] = {min: Infinity, max: -Infinity, trueMax: -Infinity};
    }
  })();

  //Sets up Commodites switch pane
  $('#map-comodities-pane>a').each(function(i) {
    $(this).attr('data-value', variables[i]);

    $(this).click(function() {
      selectedCommodity = $(this).attr('data-value');
      setVariable($(this).attr('data-value'));

      $('#map-comodities-pane a').each(function(n) {
        $(this).attr('aria-pressed', 'false');
      });

      $(this).attr('aria-pressed', 'true');
    })


    $('h1',this).mousemove(function() {
     $(this).siblings('div').show();
    });
    $('h1',this).mouseout(function() {
     $(this).siblings('div').hide();
    });
  });

  /*
   * our layers configuration object looks like this:
   *
   * <name>: { // the layer name, for reference later
   *   data: {<GeoJSON FeatureCollection>},
   *   order: "<optional Array of ordered feature names>",
   *   name: "<optional key to find the name property>"
   * }
   */
  var layers = {
    states: {
      data: statesData,
      order: statesDrawOrder
    },
    gom: {
      data: GOM_NAD27_simp,
      order: gomDrawOrder,
      name: "TEXT_LABEL"
    },
    atlantic: {
      data: ATL_NAD83_simp,
      order: atlanticDrawOrder
    },
    pacific: {
      data: PC_NAD83_simp,
      order: null
    },
    alaska: {
      data: AK_NAD83_simp,
      order: null
    }
  };

  /*
   * iterate over the layers configuration object and perform setup for each:
   *
   * 1. sort the GeoJSON features (the "data" key) if there is an "order" key
   * 2. call setRange() with the layer's data
   * 3. create an L.geoJson layer for each, and add it to the map
   * 4. push the Leaflet layer onto the dataLayers array
   */
  Object.keys(layers).forEach(function(key) {
    var entry = layers[key];
    if (entry.order) {
      sortGeoJson(entry.data, entry.order);
    }

    if (entry.name) {
      entry.data.features.forEach(function(f) {
        if (!f.properties.name) {
          f.properties.name = f.properties[entry.name];
        }
      });
    }

    var layer = L.geoJson(entry.data, {
      onEachFeature: onEachFeature
    })
    .addTo(mapdataviz);

    setRange(entry.data);
    dataLayers.push(layer);
    entry.layer = layer;

    // console.log("+ layer:", key, entry);
  });

  var statesLayer = layers.states.layer;

  var closeTooltip;
  var lastAreaViewed = false;

  setVariable(selectedCommodity);

  /******************************
  Functionality: Draw map height
  on scroll
  *******************************/
  $(window).scroll(function(event) {
    if (map_draw_init) return;
    if (isScrolledIntoView('#map')) {
      map_draw_init = true;
      updateHeights();
    }
  });

  if (isScrolledIntoView('#map')) {
    map_draw_init = true;
    updateHeights();
  }

  function setRange(data) {
    for (var i=0; i < data.features.length; i++) {
      if (!data.features[i].properties.commodities) continue;
      var feature = data.features[i];
      for (var n = 0; n < variables.length; n++) {
        var variable = variables[n],
            range = ranges[variable];
        if (feature.properties.commodities[variable]) {
          var value = feature.properties.commodities[variable].revenue;
          if (range.max < value) {
            /*
             * If value is greater than true max, set max to true max, set new true max
             * else set new max
            */
            if (range.trueMax < value) {
              if (range.trueMax === -Infinity) {
                range.max = value;
                range.trueMax = value;   
              } else {
                range.max = range.trueMax;
                range.trueMax = value; 
              }
            } else {
              range.max = value;
            }
          }
          if (range.min > value) {
            range.min = value;
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
  This function then calls updateHeights()
  to draw the 3d effect.
  ***********************************/
  function setVariable(name) {
    var range = ranges[name];
    $('div.map-scale-min').html('$' + Math.floor(range.min).formatMoney(0, '.', ','));
    $('div.map-scale-max').html('$' + range.trueMax.formatMoney(0, '.', ','));
    $('#map-scale-pane > h1').html(selectedCommodity === 'wind' ? 'Revenues' : 'Royalties');

    // update the (input) domain of the color scale,
    // according to the new variable's range, affecting
    // subsequent calls to mapColorScale(value)
    mapColorScale.domain([range.min, range.max]);
    mapColorScale_limited.domain([range.min,range.max]);

    for (var i = 0; i < dataLayers.length; i++) {
      dataLayers[i].eachLayer(updateLayerColor);
    }
    /**********************
    *If the map has been initilized
    *Draw the heights
    ***********************/
    if (map_draw_init) {
      updateHeights();
    }

    // update the map scale each time the variable changes
    updateMapScale();
  }

  function onEachFeature(feature, layer) {
    if (mobile) {
      layer.on({
        click: mouseover
      });
    } else {
      layer.on({
        mouseover: mouseover,
        mouseout: mouseout
        // click: zoomToFeature
      });
    }

    // XXX we need to do this in a setTimeout() because Leaflet doesn't 
    // create the DOM elements for each layer until *after* it's been added to
    // the map.
    setTimeout(function() {
      // XXX this is kind of a hack.
      var name = feature.properties.name,
          containers = getLayerContainers(layer)
            .classed("polygon", true),
          first = containers.node(),
          parent = d3.select(first.parentNode)
            .append("g")
              .datum(feature)
              .attr("tabindex", 1)
              .attr("aria-label", name)
              .on("focus", function() {
                mouseover({target: layer});
              })
              .on("blur", function() {
                mouseout({target: layer});
              })
              .node();
      containers.each(function() {
        parent.appendChild(this);
      });
    }, 100);
  }

  function mouseover(e) {
    if (!map_draw_init) {
      map_draw_init = true;
      updateHeights();
    }
    if (mobile) {
      if (lastAreaViewed) {
        mouseout(lastAreaViewed);
      }
      lastAreaViewed = e;
    }

    var layer = e.target;
    // setStrokeWeight(layer, '3.0');
    setFillColor(layer, '#D8D8D8'); // XXX magic color

    var revenueString = (function() {
      var selected;
      $('#map-comodities-pane a').each(function() {
        if ($(this).attr('aria-pressed') === 'true')
          selected = $(this).attr('data-value');
      });
      var revenueAmt = 0.0;
      if (layer.feature.properties.commodities) {
        if (layer.feature.properties.commodities[selected]) {
          revenueAmt = layer.feature.properties.commodities[selected].revenue;
        } else {
          revenueAmt = 0.0;
        }
      }
      var revenueType = selected.capitalize();
      var roy_rev = revenueType === 'Wind' ? ' Revenues' : ' Royalties';
      var html = ["<div>", revenueType, roy_rev, ":<br />$", revenueAmt.formatMoney(2, '.', ','), "</div>"];
      if (selected === 'oil' || selected === 'gas') {
        if (layer.feature.properties.leases) {
          html.push("<div>Producing Leases: ", layer.feature.properties.leases.active, "</div>");
          html.push("<div>Non-producing Leases: ", layer.feature.properties.leases.total, "</div>");
          html.push(
            "<aside><p><strong>Producing leases</strong> are leased Federal lands that are producing one or more commodities.</p>",
            "<p><strong>Non-producing leases</strong> are Federal lands that have been leased for exploration and development, but are not producing any commodities.</p></aside>"
          );
        }
      }
      return html.join("");
    })();

    $('#map-info-pane > h1').html(function() {
        return mobile ? layer.feature.properties.name + "<span>▲</span>" : layer.feature.properties.name + "<span></span>" 
      }
    );
    $('#map-info-pane > div').html(revenueString);
    $('#map-info-pane').show();
  }

  function mouseout(e) {
    var layer = e.target;
    statesLayer.resetStyle(layer);
    // setStrokeWeight(layer, '0.5')
    updateLayerColor(layer);

    clearTimeout(closeTooltip);
    closeTooltip = setTimeout(function() {
      mapdataviz.closePopup();
    }, 100);

    $('#map-info-pane').hide();
  }

  function zoomToFeature(e) {
    mapdataviz.fitBounds(e.target.getBounds());
  }


  function hideHeights() {
    d3.selectAll("path.stack")
      .attr("visibility", "hidden");
  }

  function redrawHeights() {
    d3.selectAll("path.stack")
      .attr("visibility", null)
      .attr("d", function(d) { return d.path.attr("d"); });
  }

  /*******************************
  function: updateHeights()
  Looks at the map and based on color,
  draws repeated shapes at an angle to
  create a 3d effect.
  The new shapes have css set to allow
  mouse events to pass through
  *********************************/
  function updateHeights() {
    var overlay = d3.select(".leaflet-overlay-pane svg"),
        layers = overlay.selectAll("g.polygon")
          .datum(function(d, i) {
            var path = d3.select(this)
                  .select("path")
                  .classed("base", true),
                color = path.attr("fill"),
                depth = getMapColorDepth(color);
            return {
              index: i,
              path: path,
              color: color,
              depth: depth
            };
          })
          .attr("data-depth", function(d) {
            return d.depth;
          });

    var stack = layers.selectAll("path.stack")
      .data(function(d, i) {
        return d3.range(0, d.depth).map(function() {
          return d;
        });
      });

    stack.exit().remove();

    stack.enter()
      .append("path")
        .attr("class", "stack")
        .attr("opacity", 0)
        .transition()
          .duration(100)
          .delay(function(d, i) { return 50 * i; })
          .attr("opacity", 1);

    var translate = 1;
    stack
      .attr("d", function(d) { return d.path.attr("d"); })
      .attr("fill", function(d) { return d.color; })
      .attr("stroke", function(d) { return d.path.attr("stroke"); })
      .attr("stroke-opacity", function(d) { return d.path.attr("stroke-opacity"); })
      .attr("stroke-width", function(d) { return d.path.attr("stroke-width"); })
      .attr("transform", function(d, i) {
        var offset = (i + 1) * translate;
        return "translate(" + [offset, -offset] + ")";
      });
  }

 

  /****************************
  Function: sortGeoJson
  Takes a GeoJson FeatureCollection and sorts its features based on an array
  which matches the name properties of each feature.
  *****************************/
  function sortGeoJson(geoJson, drawOrder) {
    var index = function(feature) {
      return drawOrder.indexOf(feature.properties.name);
    };
    // FIXME: we'll need an Array.prototype.sort() shim for IE9
    geoJson.features.sort(function(a, b) {
      return d3.ascending(index(a), index(b));
    });
  }


  /********************************************************************************************
  *Via: http://stackoverflow.com/questions/487073/check-if-element-is-visible-after-scrolling
  *********************************************************************************************/
  function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    if ($(elem).offset().top < $(window).scrollTop() + 10)
      return true;
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }

  function setStrokeWeight(layer, weight) {
    getLayerContainers(layer)
      .selectAll("path")
        .attr('stroke-width', weight);
  }
  
  function getLayerContainers(layer) {
    if (layer._layers) {
      return d3.selectAll(d3.values(layer._layers).map(function(_layer) {
        return _layer._container;
      }));
    }
    return d3.select(layer._container);
  }

  function setFillColor(layer, color) {
    getLayerContainers(layer)
      .selectAll("path")
        .attr("fill", color)
        .attr("fill-opacity", 1.0);
  }

  function updateLayerColor(layer) {
    var value = 0;
    var name = selectedCommodity;
    var max = mapColorScale.domain()[1];
    if (layer.feature.properties.commodities) {
      if (layer.feature.properties.commodities[name]) {
        value = layer.feature.properties.commodities[name].revenue;
      }
    }

    var newColor;
    if (value < 0) {
      // FIXME should we use the color for the revenue value $1?
      newColor = mapColorScale(1);
    } else if (value > max) {
      newColor = mapColorScale(value);
    } else {
      newColor = mapColorScale_limited(value);//use limited scale to avoid top color
    }

    var opacity = (value != 0) ? 1 : 0;
    layer.setStyle({
      fillColor: newColor,
      fillOpacity: opacity,
      weight: 0.5,
      data_revenue: value
    });

    // update the stacked paths as well
    getLayerContainers(layer)
      .selectAll("path.stack")
        .attr("stroke-weight", 0.5)
        .attr("fill-opacity", opacity)
        .attr("fill", newColor);
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


$(document).ready(function() {
  var mobile = $(document).width() <= 550;
  if (mobile) {
    var pane = $('#map-info-pane')
      .addClass('map-info-pane-minimized');
    $("#map-info-pane > div").css('display', 'none');
    pane.click(function(e) {
      $content = $("#map-info-pane > div");
      $content.slideToggle(500, function() {
        $('#map-info-pane > h1 > span').text(function() {
          return $content.is(":visible") ? "▼":"▲"; 
        })  
      });
    });
  }
});
