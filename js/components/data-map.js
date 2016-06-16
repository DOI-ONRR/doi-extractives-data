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

<<<<<<< a864744a1ad5f12609b0332ad91476dd3023ae26
          console.log('domain:', domain)

=======
>>>>>>> filter legend swatches
          // FIXME: do something with divergent scales??

          var scale = d3.scale[type]()
            .domain(domain)
            .range(colors);

<<<<<<< a864744a1ad5f12609b0332ad91476dd3023ae26
          // console.log('scale  :',scale)
=======
          marks.attr('fill', scale);


          function createIntervals (steps) {
            var interval = [];
            steps = +steps
            for (var i = 0; i < steps; i++) {
              interval.unshift((steps - i) / steps)
            }
            return interval;
          }

          function createDomains (interval, domain) {
            var domainStart = [],
              domainEnd = [];
            interval.forEach(function (step, i) {
              if (i === 0) {
                domainStart.push(domain[0]);
              } else {
                domainStart.push(Math.round(interval[i - 1] * domain[1]))
              }
              domainEnd.push(Math.round(step * domain[1]))
            })
            return domains = [domainStart, domainEnd];
          }


          function uniq(value, index, self) {
            return self.indexOf(value) === index;
          }

          function getUnique(data, intervals, domain) {
            var getIntervals = d3.scale[type]()
              .domain(domain)
              .range(intervals);

            var filters = [];
            data.forEach(function(d){
              filters.push(getIntervals(d))
            })

            return filters.filter(uniq);
          }

          function filterSteps(uniqueSteps, context) {

            context.querySelectorAll('[legend-swatch]')
              .forEach(function(s){
                s.setAttribute('aria-hidden', true);
              });


            uniqueSteps.forEach(function(step) {
              var allThresholds = context.querySelectorAll('[legend-swatch]');

              allThresholds.forEach(function(s){

                var diff = s.hasAttribute('legend-threshold')
                  ? +s.getAttribute('legend-threshold') - +step
                  : +s.getAttribute('data-step') - +step;

                if (diff === 0) {
                  s.setAttribute('aria-hidden', false);
                }
              });
            });
          }

          var intervals = createIntervals(steps);
          var uniqueSteps = getUnique(marks.data(), intervals, domain)
          var domains = createDomains(intervals, domain);

          var textScaleStart = d3.scale[type]()
            .domain(domain)
            .range(domains[0]);

          var textScaleEnd = d3.scale[type]()
            .domain(domain)
            .range(domains[1]);
>>>>>>> filter legend swatches

<<<<<<< d0f4f2f84a4168c2bf8257b3aaef65c0dea59db6
          marks.attr('fill', scale);
=======
          var swatches = d3.select(this)
            .selectAll('dl [data-step]')
            .datum(function() {
              return +this.getAttribute('data-step') * domain[1] || 0;
            });

          swatches.style('background-color', scale);
>>>>>>> clean up padding hack with js

<<<<<<< a864744a1ad5f12609b0332ad91476dd3023ae26

<<<<<<< 459c209440dce3833f2d31cc5ed36c539e3d7395
          // var quantize = d3.scale.quantize()
          //   .domain(domain)
          //   .range(d3.range(steps).map(function(i) { return "q" + i + "-" + steps; }));
=======
          d3.select(this).selectAll('[threshold-start]')
=======
          var threshold = d3.select(this)
              .selectAll('dl [legend-threshold]')
              .datum(function() {
                return Math.floor(+this.getAttribute('legend-threshold') * domain[1]) || 0;
              });

          d3.select(this).selectAll('[legend-start]')
>>>>>>> filter legend swatches
            .text(function (d) {
              return format.dollars(textScaleStart(d)) + ' –';
            });
          d3.select(this).selectAll('[legend-end]')
            .text(function (d) {
              return format.dollars(textScaleEnd(d));
            });
>>>>>>> hide NaN values, align swatches

<<<<<<< d0f4f2f84a4168c2bf8257b3aaef65c0dea59db6
          // var svgLegend = d3.select("svg");

          // svgLegend.append("g")
          //   .attr("class", "legendQuant")
          //   .attr("transform", "translate(20,20)");

          // var legend = d3.legend.color()
          //   .labelFormat(d3.format(".2f"))
          //   .useClass(true)
          //   .scale(quantize);
=======
          var container = d3.select(this)
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

<<<<<<< a864744a1ad5f12609b0332ad91476dd3023ae26
          container.style('padding-bottom', pixelize)
>>>>>>> clean up padding hack with js
=======
          container.style('padding-bottom', pixelize);
          filterSteps(uniqueSteps, this);
>>>>>>> filter legend swatches

          // svg:egend.select(".legendQuant")
          //   .call(legend);
        }}
      }
    )
  });

})(this);
