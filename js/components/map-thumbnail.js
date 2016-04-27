(function(exports) {

  exports.EITIMapThumbnail = document.registerElement('map-thumbnail', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: function() {
          var zoom = this.getAttribute('zoom-to') || 'svg *';
          if (zoom) {
            this.target = this.querySelector(zoom);
            if (this.target) {
              this.wait();
            }
          }
        }},

        wait: {value: function() {
          var bbox;
          var interval = setInterval((function() {
            bbox = this.target.getBBox();
            if (bbox.width && bbox.height) {
              clearInterval(interval);
              requestAnimationFrame(this.zoom.bind(this));
            }
          }).bind(this), 250);
        }},

        zoom: {value: function() {
          var bbox = this.target.getBBox();
          var svg = this.querySelector('svg');
          var viewbox = [
            bbox.x,
            bbox.y,
            bbox.width,
            bbox.height
          ].join(' ');
          svg.setAttribute('viewBox', viewbox);
        }}
      }
    )
  });

})(this);
