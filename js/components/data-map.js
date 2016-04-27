(function(exports) {

  document.registerElement('data-map', {
    'extends': 'figure',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: function() {
          var type = this.getAttribute('scale-type') || 'quantize';
          var scheme = this.getAttribute('color-scheme') || 'Blues';
          var steps = this.getAttribute('steps') || 5;
          var colors = colorbrewer[scheme][steps];
          if (!colors) {
            return console.error('bad # steps for color scheme:', scheme, steps);
          }

          var marks = d3.select(this)
            .selectAll('svg [data-value]')
            .datum(function() {
              return +this.getAttribute('data-value') || 0;
            });

          var domain = this.hasAttribute('domain')
            ? JSON.parse(this.getAttribute('domain'))
            : d3.extent(marks.data());

          var scale = d3.scale[type]()
            .domain(domain)
            .range(colors);

          marks.attr('fill', scale);
        }}
      }
    )
  });

})(this);
