(function(exports) {

  require('d3-svg-legend');

  var eiti = require('./../eiti');
  var WITHHELD_FLAG = 'Withheld';

  exports.EITIDataMap = document.registerElement('eiti-data-map', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: function() {
          var root = d3.select(this);

          this.marks = root.selectAll('[data-value]')
            .datum(function() {
              if (this.getAttribute('data-value') === null || this.getAttribute('data-value') === 'null') {

                return WITHHELD_FLAG;
              } else {
                return +this.getAttribute('data-value');
              }
            });

          if (!root.select('.svg-container').classed('wide')) {
            this.detectWidth();
          } else {
            this.isWideView = true;
          }
          this.update();
        }},

        setYear: {value: function(year) {
          this.marks.datum(function() {
              var data = JSON.parse(this.getAttribute('data-year-values') || '{}');
              if (data[year] === null || data[year] === 'null') {
                return WITHHELD_FLAG;
              } else {
                return data[year];
              }
            })
            .attr('data-value', function(d) {
              return d;
            });

          // update legend caption
          d3.select(this).selectAll('figcaption [data-year]')
            .attr('data-year', year)
            .text(year)

          this.update();
        }},

        detectWidth: {value: function() {
          var root = d3.select(this);
          var svgMap = root.select('svg.county.map');
          var svgContainer = root.select('.svg-container');
          var legendContainer = root.select('.legend-container');

          if (!svgMap.empty()) {
            var svgMapBBox = svgMap.node().getBBox();
            var svgDimensions = svgMap.attr('viewBox');

            if (svgDimensions) {
              svgDimensions = svgDimensions.split(' ');
              if (svgDimensions.length === 4) {
                var width = +svgDimensions[2];
                var height = +svgDimensions[3];
                // if a map's width is more than 50% a map's height
                // then make it a wide view
                if (width > height * 1.5) {
                  this.isWideView = true;
                  if (!svgContainer.empty()) {
                    svgContainer.classed('wide', true);
                  }

                  if (!legendContainer.empty()) {
                    legendContainer.classed('wide', true);
                  }
                }
              }
            }
          }
        }},

        update: {value: function() {


          var hasData = [];
          this.marks.data().every(function(d){
            if (d === WITHHELD_FLAG) {
              hasData.push(WITHHELD_FLAG);
              return WITHHELD_FLAG;
            } else if (d && d !== 0) {
              hasData.push(true);
              return true;
            } else {
              hasData.push(false);
              return false;
            }

          });

          var root = d3.select(this);

          if (hasData.indexOf(true) >= -1 || hasData.indexOf(WITHHELD_FLAG) >= -1) {

            if (hasData.indexOf(true) < 0) {
              root.select('.legend-data')
                .attr('aria-hidden', true);
              root.select('.legend-withheld')
                .attr('aria-hidden', false);
            } else {
              root.select('.legend-data')
                .attr('aria-hidden', false);
              root.select('.legend-withheld')
                .attr('aria-hidden', true);
            }

            root.select('.legend-no-data')
              .attr('aria-hidden', true);

            root.select('.details-container')
              .attr('aria-hidden', false);
          } else {

            root.select('.legend-data')
              .attr('aria-hidden', true);
            root.select('.legend-withheld')
              .attr('aria-hidden', true);
            root.select('.legend-no-data')
              .attr('aria-hidden', false);
            root.select('.details-container')
              .attr('aria-hidden', true)
              .select('button')
                .attr('aria-expanded', false); // unexpand county-chart
          }

          var type = this.getAttribute('scale-type') || 'quantize';
          var scheme = this.getAttribute('color-scheme') || 'Blues';
          var steps = this.getAttribute('steps') || 5;
          var units = this.getAttribute('units') || '';
          var format = this.getAttribute('format');
          var legendDelimiter = '–';
          var legendFormat = format === '$'
            ? eiti.format.dollars
            : eiti.format.si;

          var settings = {
            horizontal : {
              width: 50,
              height: 12,
              padding: 6
            },
            narrowHorizontal: {
              width: 70,
              height: 12,
              padding: 10
            },
            vertical: {
              width: 15,
              height: 15,
              padding: 6
            }
          },
          shapeWidth,
          shapeHeight,
          shapePadding;

          var colors = colorbrewer[scheme][steps];
          if (!colors) {
            return console.error(
              'bad # of steps (%d) for color scheme:', steps, scheme
            );
          }

          var marks = this.marks;

          var domain = this.hasAttribute('domain')
            ? JSON.parse(this.getAttribute('domain'))
            : d3.extent(marks.data());

          if (domain[0] > 0) {
            domain[0] = 0;
          } else if (domain[0] < 0) {
            legendDelimiter = 'to';
            domain[1] = Math.max(0, domain[1]);
          }

          // FIXME: do something with divergent scales??
          var scale = d3.scale[type]()
            .domain(domain)
            .range(colors);

          marks.attr('fill', scale);


          this.scale = scale;

          // start map legend
          function uniq(value, index, self) {
            return self.indexOf(value) === index;
          }

          function getUnique(data, steps, domain) {
            var getSteps = d3.scale[type]()
              .domain(domain)
              .range(steps);

            var values = [];
            data.forEach(function(d) {
              values.push(getSteps(d));
            });

            return values.filter(uniq);
          }


          var _steps = d3.range(0, 9)

          // find which steps are represented in the map
          var uniqueSteps = getUnique(marks.data(), _steps, domain);
          var narrowHorizontal = uniqueSteps.length < 6;

          var orient = this.isWideView
            ? 'horizontal'
            : 'vertical';

          if (narrowHorizontal && orient === 'horizontal') {
            shapeWidth = settings.narrowHorizontal.width;
            shapeHeight = settings.narrowHorizontal.height;
            shapePadding = settings.narrowHorizontal.padding;
          } else {
            shapeWidth = settings[orient].width;
            shapeHeight = settings[orient].height;
            shapePadding = settings[orient].padding;
          }

          var svgLegend = d3.select(this)
            .select('.legend-svg')
            .classed(orient, true);

          if (!svgLegend.empty()) {

            var legend = d3.legend.color()
              .labelFormat(legendFormat)
              .useClass(false)
              .orient(orient)
              .shapeWidth(shapeWidth)
              .shapeHeight(shapeHeight)
              .labelDelimiter(legendDelimiter)
              .shapePadding(shapePadding)
              .labelAlign("start")
              .scale(scale);


            var legendScale = svgLegend.select('.legendScale');
            if (legendScale.empty()) {
              legendScale = svgLegend.append('g')
                .attr('class', 'legendScale');
            }

            legendScale.call(legend);

            // start consolidate (translate) visible cells
            var cells = svgLegend.selectAll('.cell');
            var cellHeight = legend.shapeHeight() + legend.shapePadding();
            var cellWidth = legend.shapeWidth() + legend.shapePadding();
            var count = 0;

            var that = this;
            cells.each(function(cell, i) {
              var present = uniqueSteps.indexOf(i) > -1;

              if (!present) {
                // hide cells swatches that aren't in the map
                cells[0][i].setAttribute('aria-hidden', true);
                count++;
              } else  {
                if (that.isWideView) {
                  var translateWidth = (i * cellWidth) - (count * cellWidth);
                  cells[0][i].setAttribute('transform',
                    'translate(' + translateWidth + ', 0)');
                  cells[0][i].setAttribute('aria-hidden', false);
                } else {
                  // trim spacing between swatches that are visible
                  var translateHeight = (i * cellHeight) - (count * cellHeight);
                  cells[0][i].setAttribute('transform',
                    'translate(0,' + translateHeight + ')');
                  cells[0][i].setAttribute('aria-hidden', false);
                }

              }
            });
            // end consolidation
            // end map legend
          } else {
            console.warn('this <eiti-data-map> element does not have an associated svg legend.');
          }

          // start trim height on map container
          var svgContainer = d3.select(this)
            .selectAll('.svg-container[data-dimensions]')
            .datum(function() {
              var multiplier = this.classList.contains('wide')
                ? 100 + 9
                : 65.88078 + 10;

              return +this.getAttribute('data-dimensions') * multiplier;
            });

          function percentage(d) {
            return d + '%';
          }

          svgContainer.style('padding-bottom', percentage);
          // end trim

        }}
      }
    )
  });

})(this);
