(function(exports) {

  var depixelize = function(value) {
    if (value.indexOf('px') > -1) {
      return +value.substr(0, value.length - 2);
    } else {
      return value;
    }
  };

  var pixelize = function(value) {
    return value + 'px';
  };

  var hideTooltip = function (tooltip) {
    tooltip.attr('aria-hidden', true);
  };

  var attached = function() {
    var self = d3.select(this);
    var svg = d3.select('svg');
    var svgParent = self;
    var titles = self.selectAll('title');
    var tiles = self.selectAll('use');

    var tooltip,
      tooltipText;

    var init = function(initialize) {
      tooltip = self.select('.eiti-tooltip');

      if (tooltip.empty()) {
        tooltip = self.append('div')
          .classed('eiti-tooltip', true);
      }

      tooltip
        .attr('aria-hidden', true);

      tooltipText = tooltip.select('p');

      if (tooltipText.empty()) {
        tooltipText = tooltip.append('p');
      }

      // clear <title> text
      // if no javascript runs, <title> will serve as the tooltip
      // otherwise, clear it so that it doesn't interfere with
      // this tooltip
      titles.text('');
    };

    var update = function() {
      var event = event || d3.event || window.event;
      var elem = event.target || event.srcElement;

      var parentElement = d3.select(elem.parentElement);
      var title = parentElement.select('title');

      init();

      tooltipText.text(function(){
        return title.attr('desc');
      });

      tooltip
        .attr('aria-hidden', false)
        .attr('aria-label', function(){
          return title.attr('alt');
        })
        .style('left', function() {
          var tooltipWidth = depixelize(tooltip.style('width'));
          var svgWidth = depixelize(svg.style('width'));

          if (svgWidth <= tooltipWidth + event.layerX) {
            return pixelize(event.layerX - tooltipWidth);
          } else {
            return pixelize(event.layerX);
          }
        })
        .style('top', function() {
          var tooltipHeight = depixelize(tooltip.style('height'));
          var svgHeight = depixelize(svg.style('height'));

          if (svgHeight <= tooltipHeight + event.layerY) {
            return pixelize(event.layerY - tooltipHeight);
          } else {
            return pixelize(event.layerY);
          }
        });
    };

    var hide = function () {
      var event = event || window.event;
      var elem = event.target || event.srcElement;
      if (elem.nodeName === 'svg') {
        var tooltip = self.select('.eiti-tooltip');
        hideTooltip(tooltip);
      }
    };

    init(this);

    tiles.on('mouseover', update);
    svg.on('mouseout', hide);
  };

  var detached = function() { };

  exports.EITITooltipWrapper = document.registerElement('eiti-tooltip-wrapper', {
    extends: 'div',
    prototype: Object.create(
      HTMLElement.prototype,
      {
        attachedCallback: {value: attached},
        detachdCallback: {value: detached}
      }
    )
  });

})(this);

