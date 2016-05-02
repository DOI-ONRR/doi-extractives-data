(function(exports) {

  var svg = d3.select('body').append('svg').node();
  var loadEvent = 'onload' in svg ? 'load' : 'SVGLoad';
  svg.parentNode.removeChild(svg);

  exports.EITIMapThumbnail = document.registerElement('map-thumbnail', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: function() {
          this.svg = this.querySelector('svg');
          var self = this;
          this.svg.addEventListener(loadEvent, function() {
            requestAnimationFrame(function() {
              self.zoom();
            });
          });
        }},

        zoom: {value: function() {
          var target = this.getAttribute('zoom-to') || '*';
          target = this.svg.querySelector(target);
          if (!target) {
            console.error('no such target found:', target);
            return;
          }
          var bbox = target.getBBox();
          var viewbox = [
            bbox.x,
            bbox.y,
            bbox.width,
            bbox.height
          ].join(' ');
          this.svg.setAttribute('viewBox', viewbox);
        }}
      }
    )
  });

})(this);
