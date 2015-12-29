// CommonJS/RequireJS module requirements:
// http://webpack.github.io/docs/commonjs.html

// 3rd party dependencies
d3 = require("./vendor/d3.v3.min.js");
queue = require("./vendor/queue.v1.min.js");
topojson = require("./vendor/topojson.v1.min.js");
datalib = require("./vendor/datalib.min.js");
colorbrewer = require("./vendor/colorbrewer.js");
$ = jQuery = require("./vendor/jquery.min.js");

// custom map projection
albersCustom = require("./albers-custom.js");

// EITI
eiti = require("./eiti.js");

// custom elements
require("./vendor/document-register-element.js");
require("./components/eiti-map.js");
require("./components/eiti-slider.js");
require("./components/eiti-toggle.js");
require("./components/search.js");

// Glossary
_ = require("./vendor/lodash.min.js");
List = require("./vendor/list.min.js");
require("./components/glossary.js");

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-48605964-8', 'auto');
  ga('set', 'anonymizeIp', true);
  ga('set', 'forceSSL', true);
  ga('send', 'pageview');
