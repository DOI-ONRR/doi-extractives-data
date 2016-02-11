// CommonJS/RequireJS module requirements:
// http://webpack.github.io/docs/commonjs.html
(function(exports) {
  'use strict';

  // 3rd party dependencies
  var d3 = require('d3');
  exports.d3 = d3;

  // Custom map projection
  d3.geo.albersCustom = require('../albers-custom');

  // common 3rd-party dependencies
  exports.queue = require('queue-async');
  exports.topojson = require('topojson');
  exports.colorbrewer = require('colorbrewer');
  exports.$ = exports.jQuery = require('jquery');

  // EITI site-wide common code
  exports.eiti = require('../eiti');

  // custom elements polyfill
  require('document-register-element');

  exports.EITIMap = require('../components/eiti-map');
  exports.EITISlider = require('../components/eiti-slider');
  exports.EITIToggle = require('../components/eiti-toggle');

  // FIXME: does this export anything?
  require('../components/search');

  // XXX List.js's node module isn't CommonJS compatible, so we have to use a
  // built version.
  exports.List = require('../vendor/list');

  // FIXME: does this export anything?
  require('../components/glossary');
  require('../components/accordion');

  // Google Analytics
  /* jshint ignore:start */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-48605964-8', 'auto');
  ga('set', 'anonymizeIp', true);
  ga('set', 'forceSSL', true);
  ga('send', 'pageview');
  /* jshint ignore:end */

})(window);
