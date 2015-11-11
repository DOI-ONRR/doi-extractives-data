'use strict';

/* global require, window, document */

var $ = require('jquery');

// Hack: Append jQuery to `window` for use by legacy libraries
window.$ = window.jQuery = $;

var accordion = require('../../js/accordion');
var glossary = require('../../js/glossary');
var dropdown = require('../../js/dropdowns');
var siteNav = require('../../js/site-nav');
var typeahead = require('../../js/typeahead');
var typeaheadFilter = require('../../js/typeahead-filter');
var feedback = require('../../js/feedback');

var SLT_ACCORDION = '.js-accordion';

$(SLT_ACCORDION).each(function() {
  Object.create(accordion).init($(this));
});

$('.js-dropdown').each(function() {
  new dropdown.Dropdown(this);
});

$('.js-site-nav').each(function() {
  new siteNav.SiteNav(this);
});

new feedback.Feedback();

new typeahead.Typeahead('.js-search-input', $('.js-search-type').val());

new typeaheadFilter.TypeaheadFilter('.js-typeahead-filter', typeahead.datasets.committees);
