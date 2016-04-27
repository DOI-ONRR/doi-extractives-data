(function(exports) {

  document.registerElement('map-thumbnail', {
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: function() {
          var zoom = this.getAttribute('zoom-to') || 'svg *';
          if (zoom) {
            this.target = this.querySelector(zoom);
            if (this.target) {
              this.__interval = setInterval(this.wait.bind(this), 100);
            }
          }
        }},

        wait: {value: function() {
          var bbox = this.target.getBBox();
          if (bbox.width && bbox.height) {
            clearInterval(this.__interval);
            requestAnimationFrame(this.zoom.bind(this));
          }
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
