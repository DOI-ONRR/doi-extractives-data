$(document).ready(function() {

  var map_draw_init = false;

  /*
   * This is the order in which states should be drawn, which matters because
   * of the "3D" effect. Generally, the states should be ordered from top right
   * (northeast) to bottom left (southwest), but there are some edge cases.
   */
  var statesDrawOrder = [
    "Maine", "Vermont", "New Hampshire", "Massachusetts", "Rhode Island", "Connecticut", "New York",
    "New Jersey", "Pennsylvania", "Delaware", "Maryland",
    "Michigan",
    "West Virginia", "Ohio", "Virginia",
    "South Dakota",
    "Nebraska",
    "Minnesota", "Wisconsin", "North Dakota", "Montana",
    "Wyoming", "Idaho", "Washington", "Oregon",
    "Alaska", "District of Columbia",
    "Georgia", "Alabama", "Mississippi", "Arkansas",
    "Indiana", "Illinois", "Iowa", "Missouri", "Kansas",
    "Kentucky", "Tennessee",
    "North Carolina", "Oklahoma", "South Carolina",
    "Florida", "Louisiana", "Texas",
    "Colorado", "Utah", "New Mexico", "Arizona", "Nevada", "California",
    "Hawaii"
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

  // Empty Object used to 3d layers
  var dataLayers = [];
  // Default selected commodity
  var selectedCommodity = 'oil';

  // these color classes are from ColorBrewer: http://colorbrewer2.org/
  // var mapColors = "rgb(255,247,243) rgb(253,224,221) rgb(252,197,192) rgb(250,159,181) rgb(247,104,161) rgb(221,52,151) rgb(174,1,126) rgb(122,1,119)".split(" ");
  // these color classes were generated using this nifty tool: http://jsfiddle.net/d6wXV/6/embedded/result/
 // var mapColors = "#fffcca #fee0ac #fcc297 #f7a38c #ec868c #d76d93 #b65a9e #8651a8".split(" ");
  var mapColors = "#ffe77e #ddd271 #bdbd64 #9fa859 #83934e #697e43 #516938 #3b552d".split(" "); //test with green to yellow
  var NULL_COLOR = "#d8d8d8";

  /*
   * This is a quantized color, meaning that it will always return
   * one of the colors in mapColors[]. Usage:
   *
   * mapColorScale.domain([min, max]);
   * var color = mapColorScale(value);
   */
  var mapColorScale = d3.scale.threshold()
    .domain([-1e6, 0, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9])
    .range(mapColors);

  // Create one div.step for each map color, and insert them
  // into #map-scale-pane > .map-scale
  var mapScaleSteps = d3.select("#map-scale-pane .map-scale")
    .selectAll("div.step")
    .data(mapColors.map(function(color, i) {
      return {
        color: color,
        index: i
      };
    }))
    .enter()
    .append("div")
      .attr("class", "step")
      .style("background", function(d) { return d.color; })
      .style("width", (100 / mapColors.length).toFixed(3) + "%");
  // (their width is 100% / the number of colors)

  // dollar formatting (for color step HTML titles)
  var commaFormat = d3.format(","),
      dollarFormat = function(dollars) {
        return ("$" + commaFormat(~~dollars)).replace(/^\$-/, "-$");
      },
      scaleLabelFormat = (function() {
        var suffixes = {
          M: "million",
          G: "billion",
          T: "trillion"
        };
        return function scaleLabelFormat(n) {
          var prefix = d3.formatPrefix(n);
          if (prefix.symbol in suffixes) {
            return [prefix.scale(n), suffixes[prefix.symbol]].join(" ");
          } else {
            return commaFormat(n);
          }
        };
      })();

  mapScaleSteps
    .filter(function(d, i) {
      return i === 0 || i === (mapColors.length - 1);
    })
    .classed("has-label", true)
    .append("span")
      .attr("class", "label")
      .text(function(d, i) {
        var color = d.color,
            index = i ? d.index : d.index + 1,
            value = mapColorScale.domain()[index];
        return "$" + scaleLabelFormat(value);
      });

  var redrawTimeout,
      deferredRedraw = function() {
        clearTimeout(redrawTimeout);
        redrawTimeout = setTimeout(redrawHeights, 10);
      };

  var mapdataviz = L.map('map', {
      scrollWheelZoom: false,
      minZoom: 2,
      maxZoom: 6
    })
    .setView([41.5, -99.5795], mobile ? 3 : 4)
    .on("zoomstart", function() {
      hideHeights();
    })
    .on("zoomend", deferredRedraw);

  //Set Title layer, Text at bottom of map
  L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Tiles Courtesy of <a href="https://www.mapquest.com/" target="_blank">MapQuest</a>',
      maxZoom: 18,
      subdomains: [1, 2, 3, 4]
    })
    .addTo(mapdataviz);

  mapdataviz.scrollWheelZoom.disable();

  var popup = new L.Popup({ autoPan: false });

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
   * our layers configuration array contains layer objects that look like this:
   *
   * {
   *   id: "<unique ID>", // for populating layersById
   *   data: {<GeoJSON FeatureCollection>},
   *   order: "<optional Array of ordered feature names>",
   *   name: "<optional key to find the name property>"
   * }
   */
  var layers = [
    {
      id: "atlantic",
      data: ATL_NAD83_simp,
      order: atlanticDrawOrder
    },
    {
      id: "states",
      data: statesData,
      order: statesDrawOrder
    },
    {
      id: "gom",
      data: GOM_NAD27_simp,
      order: gomDrawOrder,
      name: "TEXT_LABEL"
    },
    {
      id: "pacific",
      data: PC_NAD83_simp,
      order: null
    },
    {
      id: "alaska",
      data: AK_NAD83_simp,
      order: null // FIXME: Alaska is broken
    }
  ];

  // look up a layer by ID in this object, e.g.
  // layersById["states"] or layersById.states
  var layersById = {};

  /*
   * iterate over the layers configuration object and perform setup for each:
   *
   * 1. sort the GeoJSON features (the "data" key) if there is an "order" key
   * 2. create an L.geoJson layer for each, and add it to the map
   * 3. push the Leaflet layer onto the dataLayers array
   */
  layers.forEach(function(entry) {
    layersById[entry.id] = entry;

    if (entry.name) {
      entry.data.features.forEach(function(f) {
        if (!f.properties.name) {
          f.properties.name = f.properties[entry.name];
        }
      });
    }

    if (entry.order) {
      sortGeoJson(entry.data, entry.order);
    }

    var layer = L.geoJson(entry.data, {
      onEachFeature: onEachFeature,
      color: '#272727'
    })
    .addTo(mapdataviz);

    dataLayers.push(layer);
    entry.layer = layer;

    // console.log("+ layer:", key, entry);
  });

  /*
   * XXX we do this after adding the GeoJSON layers because each layer adds its
   * own "dragend" listener to redraw itself. Adding this listener after the
   * GeoJSON layers' listeners are registered *should* guarantee that the paths
   * will have been updated when we call redrawHeights().
   */
  mapdataviz.on("dragend", deferredRedraw); // XXX magic timeout

  var statesLayer = layersById.states.layer;

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
    /*
    var extent = d3.extent(mapColorScale.domain());
    $('div.map-scale-min').text(("$" + scaleLabelFormat(extent[0])).replace(/\$-/, "-$"));
    $('div.map-scale-max').text("$" + scaleLabelFormat(extent[1]));
    */
    $('#map-scale-pane > h1').html(selectedCommodity === 'wind' ? 'Revenues' : 'Royalties');

    // update the (input) domain of the color scale,
    // according to the new variable's range, affecting
    // subsequent calls to mapColorScale(value)
    // mapColorScale.domain([range.min, range.max]);

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
              .attr("tabindex", 0)
              .attr("aria-label", name)
              .attr("aria-describedby","map-info-pane")
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
    setFillColor(layer, '#9a9a9a'); // XXX magic color

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
    var revenue = NaN,
        name = selectedCommodity,
        commodities = layer.feature.properties.commodities;
    if (commodities && commodities[name]) {
      revenue = commodities[name].revenue;
    }

    var newColor = NULL_COLOR,
        extent = d3.extent(mapColorScale.domain());
    if (!isNaN(revenue)) {
      if (revenue < extent[0]) {
        newColor = mapColors[0];
      } else if (revenue > extent[1]) {
        newColor = mapColors[mapColors.length - 1];
      } else {
        newColor = mapColorScale(revenue);
      }
    }

    layer.setStyle({
      fillColor: newColor,
      fillOpacity: 1,
      weight: 0.5
    });

    // update the stacked paths as well
    getLayerContainers(layer)
      .selectAll("path.stack")
        .attr("stroke-weight", 0.5)
        .attr("fill", newColor);
  }

  /*
   * Update the map scale by setting the title attribute of each of
   * the color steps.
   */
  function updateMapScale() {
    mapScaleSteps
      .attr("title", function(d, i) {
        var extent = mapColorScale.invertExtent(d.color);
        if (i === 0 && !isFinite(extent[0])) {
          return dollarFormat(extent[1]) + " or less";
        }
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
