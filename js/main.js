// CommonJS/RequireJS module requirements:
// http://webpack.github.io/docs/commonjs.html

// 3rd party dependencies
d3 = require("./vendor/d3.v3.min");
queue = require("./vendor/queue.v1.min");
topojson = require("./vendor/topojson.v1.min");
datalib = require("./vendor/datalib.min");
colorbrewer = require("./vendor/colorbrewer");
$ = jQuery = require("./vendor/jquery.min");

// Custom map projection
albersCustom = require("./albers-custom");

// EITI
eiti = require("./eiti");

// custom elements
require("./vendor/document-register-element");
require("./components/eiti-map");
require("./components/eiti-slider");
require("./components/eiti-toggle");
require("./components/search");

// Glossary
_ = require("./vendor/lodash.min");
List = require("./vendor/list.min");
require("./components/glossary");

// Google Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-48605964-8', 'auto');
  ga('set', 'anonymizeIp', true);
  ga('set', 'forceSSL', true);
  ga('send', 'pageview');
