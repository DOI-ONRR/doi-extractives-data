(function() {

  // the pack layout is square, so there's only one size dimension
  var size = 620,
      // our sequential list of years to display (in tabs, and in content)
      years = [
        2012,
        2013
      ],
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
      sections = d3.select(".disbursement_container")
        .selectAll("div.disbursement")
        .data(years.map(function(year) {
          return {year: year};
        }))
        .enter()
        .append("div")
          .attr("class", "disbursement")
          .attr("data-year", function(d) { return d.year; }),
      // use the same pack layout for all years
      pack = d3.layout.pack()
        .sort(function(a, b) {
          return d3.descending(a.shore, b.shore)
              || d3.descending(a.value, b.value);
        })
        .size([size, size])
        .padding(10);

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
    }
  };

  // load the data...
  d3.json("static/data/disbursement-summary-data.json", function(error, data) {

    // create an <svg> for each section
    var svg = sections.append("svg")
      .attr("class", "pack")
      .attr("width", size)
      .attr("height", size);

    var info = sections.append("div")
      .attr("class", "info")
      .attr("id", function(d) {
        return "bubble-info-" + d.year;
      })
      .text(function(d) {
        return "TODO: info for year " + d.year;
      });

    // and a root <g.nodes> for all of its contents
    var g = svg.append("g")
      .attr("class", "nodes");

    // create a <g.node> for each "leaf" of the tree
    var node = g.selectAll(".node")
      .data(function(d) {
        return pack
          .nodes(flatten(data, d.year))
          .filter(function(node) { return !node.children; });
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
        .on("mouseover", function(d) {
          // move to front on mouseover
          d3.select("#bubble-info-" + d.year)
            .text("TODO: info for " + d.name);
        });

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
          return Math.ceil(d.rect.height);
        })
        .select("g.nodes")
          .attr("transform", function(d) {
            return "translate(" + [0, -d.rect.y] + ")";
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
    selectYear(years[0]);
  });

  // select a disbursement year (Number)
  function selectYear(year) {
    tabs.classed("active", function(d) {
      return d === year;
    });
    sections.style("display", function(d) {
      return d.year === year ? null : "none";
    });
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

})();
