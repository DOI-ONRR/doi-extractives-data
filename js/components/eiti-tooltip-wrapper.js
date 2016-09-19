/* jshint node: true, browser: true */
(function(exports) {
  'use strict';

  var OFFSET_POSITION = 2;

  var depixelize = function(value) {
    if (value.match(/px$/)) {
      return Number(value.substr(0, value.length - 2));
    } else {
      return value;
    }
  };

  var pixelize = function(value) {
    return value + 'px';
  };

  var show = function() {
    this.attr('aria-hidden', false);
  };

  var hide = function() {
    this.attr('aria-hidden', true);
  };

  var attached = function() {
    var self = d3.select(this);
    var svg = self.select('svg');
    var titles = self.selectAll('title');
    var tiles = self.selectAll('use');

    var tooltip;
    var tooltipText;

    var init = function() {
      tooltip = self.select('.eiti-tooltip');

      if (tooltip.empty()) {
        tooltip = self.append('div')
          .classed('eiti-tooltip', true);
      }

      tooltip.call(hide);

      tooltipText = tooltip.select('p');

      if (tooltipText.empty()) {
        tooltipText = tooltip.append('p');
      }

      // if <title> tags do not have 'desc' or 'alt' attributes
      // use text instead
      titles
        .attr('desc', function(){
          var self = d3.select(this);
          return self.attr('desc') || self.text();
        })
        .attr('alt', function(){
          var self = d3.select(this);
          return self.attr('alt') || self.text();
        })
        // clear <title> text
        // if no javascript runs, <title> will serve as the tooltip
        // otherwise, clear it so that it doesn't interfere with
        // this tooltip
        .text('');
    };

    var update = function() {
      var event = event || d3.event || window.event;
      var elem = event.target || event.srcElement;
      var parentElement = d3.select(elem.parentElement);
      var title = parentElement.select('title');

      init();

      if (!title.empty()) {
        tooltipText.text(function() {
          return title.attr('desc');
        });

        // before rendering the tooltip, ensure that there is text
        if (tooltipText.text()) {
          tooltip
          .call(show)
          .attr('aria-label', function() {
            return title.attr('alt');
          })
          .style('left', function() {
            var tooltipWidth = depixelize(tooltip.style('width'));
            var svgWidth = depixelize(svg.style('width'));

            var x = event.layerX + OFFSET_POSITION;

            if (svgWidth <= tooltipWidth + x) {
              return pixelize(event.layerX - tooltipWidth - OFFSET_POSITION);
            } else {
              return pixelize(x);
            }
          })
          .style('top', function() {
            var tooltipHeight = depixelize(tooltip.style('height'));
            var svgHeight = depixelize(svg.style('height'));

            var y = event.layerY + OFFSET_POSITION;

            if (svgHeight <= tooltipHeight + y) {
              return pixelize(event.layerY - tooltipHeight - OFFSET_POSITION);
            } else {
              return pixelize(y);
            }
          });
        }
      }

    };

    var mouseout = function() {
      var event = event || d3.event || window.event;
      var elem = event.target || event.srcElement;
      if (elem.nodeName.toLowerCase() === 'svg') {
        self.select('.eiti-tooltip')
          .call(hide);
      }
    };

    init(this);

    tiles.on('mouseover', update);
    svg.on('mouseout', mouseout);
  };

  var detached = function() { };

  exports.EITITooltipWrapper = document.registerElement(
    'eiti-tooltip-wrapper',
    {
      extends: 'div',
      prototype: Object.create(
        HTMLElement.prototype,
        {
          attachedCallback: {value: attached},
          detachdCallback: {value: detached}
        }
      )
    }
  );

})(this);
