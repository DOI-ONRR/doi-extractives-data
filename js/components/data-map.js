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

          console.log('domain:', domain)

          // FIXME: do something with divergent scales??

          var scale = d3.scale[type]()
            .domain(domain)
            .range(colors);

          // console.log('scale  :',scale)

          marks.attr('fill', scale);


<<<<<<< 459c209440dce3833f2d31cc5ed36c539e3d7395
          // var quantize = d3.scale.quantize()
          //   .domain(domain)
          //   .range(d3.range(steps).map(function(i) { return "q" + i + "-" + steps; }));
=======
          d3.select(this).selectAll('[threshold-start]')
            .text(function (d) {
              console.log(d)
              return format.commaSeparatedDollars(textScaleStart(d)) + ' –';
            });
          d3.select(this).selectAll('[threshold-end]')
            .text(function (d) {
              return format.commaSeparatedDollars(textScaleEnd(d));
            });
>>>>>>> hide NaN values, align swatches

          // var svgLegend = d3.select("svg");

          // svgLegend.append("g")
          //   .attr("class", "legendQuant")
          //   .attr("transform", "translate(20,20)");

          // var legend = d3.legend.color()
          //   .labelFormat(d3.format(".2f"))
          //   .useClass(true)
          //   .scale(quantize);

          // svg:egend.select(".legendQuant")
          //   .call(legend);
        }}
      }
    )
  });

})(this);
