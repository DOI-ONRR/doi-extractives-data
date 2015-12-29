// // 3rd party dependencies
// require("./vendor/d3.v3.min.js");
// require("./vendor/colorbrewer.js");
// require("./vendor/jquery.min.js");

// // custom map projection
// require("./albers-custom.js");

// // EITI libs
require("./eiti.js");

// // custom elements
require("./vendor/document-register-element.js");
require("./components/eiti-map.js");
require("./components/eiti-slider.js");
require("./components/eiti-toggle.js");
require("./components/search.js");

console.log(eiti, '--', window, '--', exports)

// Glossary
// require("./vendor/lodash.min.js");
// require("./vendor/list.min.js");
// require("./components/glossary.js");


// <script src="{{ site.baseurl }}/js/eiti.js"></script>
//     <script>
//       eiti.data.path = '{{ site.baseurl }}/data/';
//       eiti.commodities = ({{ site.data.commodities|jsonify }});
//       eiti.resource = ({{ site.data.resource|jsonify }});
//     </script>


// currently eiti and List are experiencing issues with CommonJS/RequireJS module requirement:
// http://webpack.github.io/docs/commonjs.html
