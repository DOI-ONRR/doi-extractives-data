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
  exports.queue = require('d3-queue');
  exports.topojson = require('topojson');
  exports.$ = exports.jQuery = require('jquery');

  // EITI site-wide common code
  exports.eiti = require('../eiti');

  // custom elements polyfill
  require('document-register-element');

  exports.EITIMap = require('../components/eiti-map');
  exports.EITISlider = require('../components/eiti-slider');
  exports.EITIToggle = require('../components/eiti-toggle');

  // XXX List.js's node module isn't CommonJS compatible, so we have to use a
  // built version.
  exports.List = require('../vendor/list');

  exports.Glossary = require('../components/glossary');
  exports.Accordion = require('../components/accordion');

  $(function () {
    var glossary = new exports.Glossary(),
      accordion = new exports.Accordion();
  });

  var svg4everybody = require('svg4everybody');
  svg4everybody();


  console.log('yo')

  /*
   * Params:
   * - query: query string
   * - results: search results matching the query
   * - doc: window.document object
   * - resultsElem: HTML element to which generated search results elements will
   *     be appended
   */
  function renderJekyllPagesApiSearchResults(query, results, doc, resultsElem) {
    console.log(query)
    console.log(results)
    console.log(doc)
    console.log(resultsElem)
    results.forEach(function(result, index) {
      var item = doc.createElement('li'),
          link = doc.createElement('a'),
          text = doc.createTextNode(result.title);

      link.appendChild(text);
      link.title = result.title;
      link.href = result.url;
      item.appendChild(link);
      resultsElem.appendChild(item);

      link.tabindex = index;
      if (index === 0) {
        link.focus();
      }
    });
  }

})(window);
