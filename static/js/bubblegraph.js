(function() {

  // the pack layout is square, so there's only one size dimension
  var size = 620,
      // our sequential list of years to display (in tabs, and in content)
      years = [
        2012,
        2013
      ],
      // space around the circles (for stroke, etc.)
      margin = 4,
      // create a tab for each disbursement year
      tabs = d3.select(".bubble_tabs")
        .selectAll("a")
        .data(years)
        .enter()
        .append("a")
          .attr("href", "javascript:void(0)")
          .text(function(d) { return d; })
          .on("click", selectYear),
      // and create a section div for each disbursement year
      sections = d3.select(".bubbles .years")
        .selectAll(".disbursement_year")
        .data(years.map(function(year) {
          return {year: year};
        }))
        .enter()
        .append("div")
          .attr("class", "disbursement_year")
          .attr("data-year", function(d) { return d.year; }),
      // use the same pack layout for all years
      pack = d3.layout.pack()
        .sort(function(a, b) {
          return d3.descending(a.shore, b.shore)
              || d3.descending(a.value, b.value);
        })
        .size([size - margin * 2, size - margin * 2])
        .padding(10);

  var fundInfo = d3.select(".bubbles .fund-info")
    .style("display", "none");

  fundInfo.select(".close")
    .on("click", function() {
      fundInfo.style("display", "none");
    });

  // visual data tweaks, by element id
  var tweaks = {
    "bubble_2012_U_S__Treasury_onshore": {
      wrap: true
    },
    "bubble_2013_U_S__Treasury_onshore": {
      wrap: true
    },
    "bubble_2012_American_Indian_Tribes_onshore": {
      x: -5
    },
    "bubble_2013_Historic_Preservation_Fund_offshore": {
      x: 15,
      y: 30,
      wrap: false
    },
    "bubble_2013_States_offshore": {
      x: 20,
      y: 1
    },
    "bubble_2012_Historic_Preservation_Fund_offshore":{
      wrap:false,
      x: 30,
      y: 25
    },
    "bubble_2012_States_offshore":{
      x: 15,
      y: 15
    }
  };

  // icon {id: label} mapping
  var iconLabels = {
    "book":       "Book",
    "buildings":  "Buildings",
    "dam":        "Dam",
    "hospital":   "Hospital",
    "microphone": "Microphone",
    "mountains":  "Mountains",
    "plane":      "Airplane",
    "school":     "Schoolhouse",
    "swamp":      "Swamp",
    "swings":     "Playground",
    "wheat":      "Farm"
  };

  var defaultDisplay = d3.select(".bubbles .default-display");
  defaultDisplay.select(".icons")
    .selectAll(".icon")
    .data(Object.keys(iconLabels).map(function(key) {
      return {
        id: key,
        label: iconLabels[key]
      };
    }))
    .enter()
    .append("svg")
      .call(createIcon)
      .call(updateIcon);

  // timeout for hiding the bubble info
  var infoTimeout;

  queue([
    "static/data/fund-metadata.json",
    "static/data/disbursement-summary-data.json"
  ], function(error, fundMeta, data) {

    // console.log("fund metadata:", fundMeta);
    // console.log("disbursements:", data);

    // create an <svg> for each section as the first child
    var svg = sections.append("svg")
      .attr("class", "pack")
      .attr("width", size)
      .attr("height", size);

    var info = sections.append("div")
      .attr("class", "bubble-info")
      .attr("id", function(d) {
        return "bubble-info-" + d.year;
      })
      .style("display", "none");

    var infoH1 = info.append("h1")
    infoH1.append("span")
      .attr("class", "name");
    infoH1.append("span")
      .attr("class", "context")
      .html('<span class="year">(year)</span> <span class="shore">(shore)</span> revenues of');
    info.append("h2")
      .html('<b>$<span class="revenue"></span> billion</b>, which helped fund');
    info.append("div")
      .attr("class", "icons");

    // and a root <g.nodes> for all of its contents
    var g = svg.append("g")
      .attr("class", "nodes");

    // create a <g.node> for each "leaf" of the tree
    var node = g.selectAll(".node")
      .data(function(d) {
        var nodes = pack
          .nodes(flatten(data, d.year))
          .filter(function(node) { return !node.children; });
        nodes.forEach(function(d) {
          d.meta = fundMeta[d.name][d.shore];
        });
        return nodes;
      })
      .enter()
      .append("g")
        .attr("id", function(d) {
          d.id = ["bubble", d.year, d.name, d.shore].join("-").replace(/[^\w]/g, "_");
          d.tweaks = tweaks[d.id] || {};
          return d.id;
        })
        .attr("class", function(d) {
          return ["node", d.shore].join(" ");
        })
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")";
        })
        .on("mouseover", highlightFund)
        .on("mouseout", unhighlightFund)
        .on("click", selectFund);

    node.sort(function(a, b) {
      return d3.descending(a.r, b.r);
    });

    // create a <circle> for each node
    var circle = node.append("circle")
      .attr("r", function(d) {
        return d.r;
      });

    /*
     * bind the <svg> elements to a data object that gives us the bounding box
     * of its contents (the first child, <g.nodes>), then set its height
     * accordingly and translate the <g.nodes> up to meet the top edge
     */
    sections
      .each(function(d) {
        d.rect = this.querySelector("g.nodes").getBBox();
      })
      .select("svg")
        .attr("height", function(d) {
          return Math.ceil(d.rect.height) + margin * 2;
        })
        .select("g.nodes")
          .attr("transform", function(d) {
            return "translate(" + [margin, margin - Math.round(d.rect.y)] + ")";
          });

    // create a <g> element to contain the text
    var text = node.append("g")
      .attr("class", "text")
      .attr("text-anchor", "start")
      .attr("pointer-events", "none");

    // and create a <text> element for each "line" of the wrapped title
    text.selectAll("text")
      .data(function(d) {
        var name = d.name.replace(/ Funds?$/, "");
        if (d.tweaks.wrap === false) {
          return d.lines = [name];
        } else if (d.tweaks.wrap === true) {
          return d.lines = name.split(" ");
        }
        return d.lines = wrapName(name, d.r);
      })
      .enter()
      .append("text")
        .text(function(line) {
          return line;
        });

    text.each(function(d) {
      var dy = (d.lines.length > 1)
            ? .5 - d.lines.length / 2
            : 0,
          t = {
            x: d.tweaks.x || 0,
            y: d.tweaks.y || 0
          };
      d3.select(this)
        .attr("transform", "translate(" + [t.x + d.lines.length * 6 - d.r, t.y] + ")")
        .selectAll("text")
          .attr("dy", function(line, i) {
            return (i + dy + .33) + "em";
          });
    });

    /*
     * select the first year
     * (do this after loading data so that we can measure bounding rectangles
     * before hiding the enclosing div w/`display: none`)
     */
    selectYear(2013);

  }); // end load data in parallel

  // select a disbursement year (Number)
  function selectYear(year) {
    tabs.classed("active", function(d) {
      return d === year;
    });
    sections.style("display", function(d) {
      return d.year === year ? null : "none";
    });
    // hide the fund info
    fundInfo.style("display", "none");
  }

  /*
   * Get an array of wrapped text lines for a given name (String) and circle
   * radius (Number).
   */
  function wrapName(name, radius) {
    var lineLength = Math.max(radius, 150) / 10;
    if (name.length > lineLength) {
      var words = name.split(" "),
          line = "",
          lines = [];
      words.forEach(function(word) {
        if ((line.length + word.length) < lineLength) {
          line += " " + word;
        } else {
          lines.push(line);
          line = word;
        }
      });
      if (line) lines.push(line);
      return lines;
    }
    return [name];
  }

  // Get a flattened hierarchy containing all leaf nodes under the root.
  function flatten(root, year) {
    var nodes = [];

    function recurse(name, node) {
      if (node.children) {
        node.children.forEach(function(child) {
          recurse(node.name, child);
        });
      } else if (+node.year === year) {
        nodes.push({
          name:   node.name,
          value:  node.total,
          shore:  node.shore,
          year:   node.year
        });
      }
    }

    recurse(null, root);
    return {children: nodes};
  }

  function updateMetadata(selection) {
    var format = d3.format(".3f"),
        billion = 1e9;

    selection.select(".name")
      .text(function(d) { return d.name; });
    selection.select(".context")
      .attr("class", function(d) {
        return ["context", d.shore].join(" ");
      });
    selection.select(".year")
      .text(function(d) { return d.year; });
    selection.select(".shore")
      .text(function(d) { return d.shore; });
    selection.select(".revenue")
      .text(function(d) { return format(d.value / billion); });

    var icons = selection.select(".icons")
      .selectAll(".icon")
        .data(function(d) {
          return d.meta.icons.map(function(id) {
            return {
              id: id,
              label: iconLabels[id] || id
            };
          });
        });

    icons.exit()
      .remove();

    icons.enter()
      .append("svg")
        .call(createIcon);

    icons
      .call(updateIcon);
  }

  function createIcon(selection) {
    selection
      .attr("role", "img")
      .attr("class", "icon")
      .append("use");
  }

  function updateIcon(selection) {
    selection
      .attr("class", function(d) {
        return ["icon", d.id].join(" ");
      })
      .attr("aria-label", function(d) {
        return d.label;
      })
      .select("use")
        .attr("xlink:xlink:href", function(d) {
          return window.site.baseurl + "/static/fonts/EITI/icons.svg#eiti-" + d.id;
        });
  }

  function highlightFund(fund) {
    clearTimeout(infoTimeout);
    defaultDisplay.style("display", "none");
    // bind the data for the bubble and the fund metadata to the
    // corresponding info bubble div, then call updateMetadata() on it
    d3.select("#bubble-info-" + fund.year)
      .style("display", null)
      .datum(fund)
      .call(updateMetadata);
  }

  function unhighlightFund(fund) {
    infoTimeout = setTimeout(function() {
      defaultDisplay.style("display", null);
      // hide the bubble info panel on mouseout
      d3.select("#bubble-info-" + fund.year)
        .style("display", "none");
    }, 200);
  }

  function selectFund(fund) {
    fundInfo
      .style("display", null);

    fundInfo.select(".name")
      .attr("class", ["name", fund.shore].join(" "))
      .select(".text")
        .text(fund.name);

    fundInfo.select(".content")
      .html(fund.meta.content);
  }

  /*
   * This is a super-dirty little hack to load multiple JSON URLs in parallel,
   * substituting positional arguments for the data returned in each URL.
   *
   * queue(["foo.json", "bar.json"], function(error, foo, bar) {
   *   if (error) {
   *     // do something and bail
   *     return;
   *   }
   *   // do something with `foo` and `bar`
   * });
   */
  function queue(urls, callback) {
    var data = [],
        count = urls.length;
    return reqs = urls.map(function(url, i) {
      return d3.json(url, function(error, res) {
        if (error) return callback(error);
        data[i] = res;
        if (--count === 0) {
          callback.apply(null, [null].concat(data));
        }
      });
    });
  }

})();
