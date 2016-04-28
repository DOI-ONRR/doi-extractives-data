var jsdom = require('jsdom');

module.exports = function(generate, done) {
  var async = generate.length > 1;
  jsdom.env('<svg></svg>', [], function(errors, window) {
    if (errors) {
      return done(errors[0]);
    }

    var svg = window.document.querySelector('svg');
    if (async) {
      generate.call(window, svg, done);
    } else {
      generate.call(window, svg);
      done(null, svg);
    }
  });
};
