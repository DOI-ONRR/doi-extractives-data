(function(exports) {

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

          var colors = colorbrewer[scheme][steps];
          if (!colors) {
            return console.error(
              'bad # of steps (%d) for color scheme:', steps, scheme
            );
          }

          var marks = d3.select(this)
            .selectAll('svg [data-value]')
            .datum(function() {
              // console.log('value',+this.getAttribute('data-value'))
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

          // console.log('domain:', domain)

          // FIXME: do something with divergent scales??

          var scale = d3.scale[type]()
            .domain(domain)
            .range(colors);


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
                // console.log(interval[i-1])
                domainStart.push(Math.round(interval[i - 1] * domain[1]))
              }

              domainEnd.push(Math.round(step * domain[1]))
            })

            return domains = [domainStart, domainEnd];
          }

          var intervals = createIntervals(steps)
          var domains = createDomains(intervals, domain)

          var textScaleStart = d3.scale[type]()
            .domain(domain)
            .range(domains[0]);

          var textScaleEnd = d3.scale[type]()
            .domain(domain)
            .range(domains[1]);

          // console.log(domain[0], colors)

          var leg = d3.select(this)
            .selectAll('dl [data-step]')
            .datum(function() {
              return +this.getAttribute('data-step') * domain[1] || 0;
            });
          // console.log(leg, marks)

          leg.style('background-color', scale)


        var threshold = d3.select(this)
            .selectAll('dl [swatch-threshold]')
            .datum(function() {
              return Math.floor(+this.getAttribute('swatch-threshold') * domain[1]) || 0;
            });

        d3.select(this).selectAll('.start')
          .text(function (d) {
            return format.commaSeparatedDollars(textScaleStart(d));
          });
        end = d3.select(this).selectAll('.end')
          .text(function (d) {
            return format.commaSeparatedDollars(textScaleEnd(d));
          })

        marks.attr('fill', scale);

        }}
      }
    )
  });

})(this);
