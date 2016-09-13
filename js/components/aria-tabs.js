$(function() {
  'use strict';

  var d3 = require('d3');
  var receptor = require('receptor');

  var tablist = d3.selectAll('[role=tablist]');

  var clickHandler = receptor.delegate('[role=tab]', function(e) {
    // prevent link follows
    e.preventDefault();
    toggle(this);
  });

  var toggle = function(tab) {
    var list = tab.closest('[role=tablist]');
    d3.select(list)
      .selectAll('li')
        .attr('role', 'presentation')
        .select('[role=tab]')
          .attr('aria-expanded', function() {
            return this === tab;
          })
          .each(function() {
            var panel = getPanelFor(this);
            var active = this === tab;
            if (panel) {
              d3.select(panel)
                .attr('tabindex', active ? 0 : -1)
                .attr('aria-hidden', !active);
            } else {
              console.warn('no panel for:', this);
            }
          });
  };

  var getPanelFor = function(tab) {
    var id = tab.getAttribute('aria-controls');
    if (!id && tab.hasAttribute('href')) {
      id = tab.getAttribute('href').substr(1);
      tab.setAttribute('aria-controls', id);
    }
    return document.getElementById(id);
  };

  tablist
    .on('click', function() {
      clickHandler.call(this, d3.event);
    })
    .each(function() {
      var tabs = this.querySelectorAll('[role=tab]');
      var expanded = this.querySelector('[role=tab][aria-expanded=true]');
      toggle(expanded || tabs[0]);
    });

});
