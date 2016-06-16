(function(exports) {

  exports.EITIDataMap = document.registerElement('data-map', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        createdCallback: function() {
          var svg = d3.select(this).append('svg');

          var legend = d3.select(this).append('svg')
          // for (step in steps.length) {
          var swatch = legend.append('rect')

          swatch.attr('class', 'swatch')
            .attr('height', 10)
            .attr('width', 10)
            .attr('fill', '#ccc');
          // }


          this.values = this.getAttribute('values') || [];
          this.dot = this.getAttribute('dot');
          this.line = this.getAttribute('line');
        },
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


          // console.log('scale  :',scale)



          var intervals = createIntervals(steps);
          var _steps = createSteps(steps);
          console.log(intervals)

          var uniqueSteps = getUnique(marks.data(), _steps, domain)
          var domains = createDomains(intervals, domain);

          var textScaleStart = d3.scale[type]()
            .domain(stepDomain)
            .range(domains[0]);

          var textScaleEnd = d3.scale[type]()
            .domain(stepDomain)
            .range(domains[1]);

          var swatches = d3.select(this)
            .selectAll('dl [data-step]')
            .datum(function() {
              return +this.getAttribute('data-step') || 1;
            });

          swatches.style('background-color', scaleSteps);

          format.start = function(value, units) {
            if (units === '$' || units.includes('dollar')) {
              return [format.dollars(value), ' –'].join(' ');
            } else {
              return [format.si(value), ' –'].join(' ');
            }
          }

          format.end = function(value, units) {
            if (units === '$' || units.includes('dollar')) {
              return format.si(value);
            } else if (units.includes('kilowatt')) {
              return [format.si(value), 'kWh'].join(' ');
            } else if(units.includes('thousands of pounds')) {
              return [format.si(value), 'thousands of pounds'].join(' ');
            } else if(units.includes('millions of btus')) {
              return [format.si(value), 'millions of btus'].join(' ');
            } else {
              return [format.si(value), units].join(' ');
            }
          }

          d3.select(this)
              .selectAll('dl [legend-threshold]')
              .datum(function() {
                return +this.getAttribute('legend-threshold') || 1;
              });

          d3.select(this).selectAll('[legend-start]')
            .text(function (d) {
              return format.start(textScaleStart(d), units);
            });
          d3.select(this).selectAll('[legend-end]')
            .text(function (d) {
              return format.end(textScaleEnd(d), units);
            });

          // only show swatches that show up in map
          filterSteps(uniqueSteps, this);

          // trim height on map container
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

        }}
      }
    )
  });

})(this);
