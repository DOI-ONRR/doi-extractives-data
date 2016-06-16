(function(exports) {

  require('d3-svg-legend');

  var eiti = require('./../eiti');
  var format = eiti.format;

  exports.EITIDataMap = document.registerElement('data-map', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: function() {
          this.update();
        }},

        update: {value: function() {
          var type = this.getAttribute('scale-type') || 'quantize';
          var scheme = this.getAttribute('color-scheme') || 'Blues';
          var steps = this.getAttribute('steps') || 5;
          var units = this.getAttribute('units') || '';

          var stepDomain = [1, 9];

          var colors = colorbrewer[scheme][steps];
          if (!colors) {
            return console.error(
              'bad # of steps (%d) for color scheme:', steps, scheme
            );
          }

          var marks = d3.select(this)
            .selectAll('svg [data-value]')
            .datum(function() {
              return +this.getAttribute('data-value') || 0;
            });

          var domain = this.hasAttribute('domain')
            ? JSON.parse(this.getAttribute('domain'))
            : d3.extent(marks.data());

          if (domain[0] > 0) {
            domain[0] = 0;
          } else if (domain[0] < 0) {
            domain[1] = Math.max(0, domain[1]);
          }

          // FIXME: do something with divergent scales??

          var scale = d3.scale[type]()
            .domain(domain)
            .range(colors);

          var scaleSteps = d3.scale[type]()
            .domain(stepDomain)
            .range(colors);

          marks.attr('fill', scale);


          // start map legend
          function uniq(value, index, self) {
            return self.indexOf(value) === index;
          }

          function getUnique(data, steps, domain) {
            var getSteps = d3.scale[type]()
              .domain(domain)
              .range(steps);

            var values = [];
            data.forEach(function(d){
              values.push(getSteps(d));
            });

            return values.filter(uniq);
          }

          var legend = d3.select(this)
            .select(".legend-svg");

          legend.append("g")
            .attr("class", "legendScale");

          var legendColor = d3.legend.color()
            .labelFormat(format.si)
            .useClass(false)
            .ascending(true)
            .labelDelimiter('-')
            .shapePadding(6)
            .scale(scale);

          legend.select(".legendScale")
            .call(legendColor);

          // reverse because the scale is in ascending order
          var _steps = d3.range(0,9).reverse();

          // find which steps are represented in the map
          var uniqueSteps = getUnique(marks.data(), _steps, domain);

          // start consolidate (translate) visible cells
          var cells = legend.selectAll('.cell')
          var cellHeight = legendColor.shapeHeight() +
            legendColor.shapePadding();
          var count = 0;
          cells.each(function(cell, i){
            var present = uniqueSteps.indexOf(i) > -1;

            if (!present) {
              // hide cells swatches that aren't in the map
              cells[0][i].setAttribute('aria-hidden', true);
              count++
            } else  {
              // trim spacing between swatches that are visible
              var translateHeight = (i * cellHeight) - (count * cellHeight)
              cells[0][i].setAttribute('transform', 'translate(0,' + translateHeight + ')');
            }
          });
          // end consolidation
          // end map legend

           // start trim height on map container
           var svgContainer = d3.select(this)
             .selectAll('.svg-container[data-dimensions]')
             .datum(function() {
               return (this.getBoundingClientRect().width
                 * +this.getAttribute('data-dimensions')
                 / 100)
                 + 50;
             });

           function pixelize(d) {
             return d + 'px';
           }

           svgContainer.style('padding-bottom', pixelize);
           // end trim
        }}
      }
    )
  });

})(this);
