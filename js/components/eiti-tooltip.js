(function(exports) {

  var findParentSVG = function (childObj) {
    var obj = childObj.parentNode;
    while(obj.tagName !== 'svg') {
      obj = obj.parentNode;
    }
    return obj;
  }

  var attached = function() {
    var root = d3.select(this);
    var self = d3.select(this);
    var svg = d3.select(findParentSVG(this))
    var svgParent = d3.select(findParentSVG(this).parentElement);
    var parent = d3.select(this.parentElement).select('use');

    var hideTooltip = function (tooltip) {
      tooltip.attr('aria-hidden', true);
    }

    var update = function() {
      console.log(event)
      var delay = 200;

      var tooltip = svgParent.select('.eiti-tooltip');

      if (tooltip.empty()) {
        svgParent.append('div')
        .classed('eiti-tooltip', true)
      }

      tooltip.attr('aria-label', function(){
          return self.attr('alt');
        })
        .attr('aria-hidden', false)
        .transition()
        .delay(delay)
        .style('left', function() {
          return event.layerX + 'px';
        })
        .style('top', function() {
          return event.layerY + 'px';
        })

      var tooltipText = tooltip.select('p');

      if (tooltipText.empty()) {
        tooltipText = tooltip
          .append('p')
      }

      tooltipText.text(function(){
        console.log(self)
        return self.attr('desc');
      });

      // setTimeout(function() {
      //   hideTooltip(tooltip);
      // }, 5000);
    }


    var hide = function () {
      var tooltip = self.select('.tooltip');
      hideTooltip(tooltip);
    }

    parent.on('mouseover', update);

    // svg.on('mouseleave', hide);
  };

  var detached = function() {
  };

  exports.EITITooltip = document.registerElement('eiti-tooltip', {
    extends: 'title',
    prototype: Object.create(
      SVGElement.prototype,
      {
        attachedCallback: {value: attached},
        detachdCallback: {value: detached}
      }
    )
  })

})(this);

