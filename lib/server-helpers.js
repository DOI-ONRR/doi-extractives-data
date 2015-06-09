var tito = require('tito');
var streamify = require('stream-array');
var dl = require('datalib');

/*
 * Returns a function that renders the response with the named
 * template, which can either be a full filename ("index.html") or
 * a basename without the extension ("index").
 */
var view = function(template, data) {
  return function(req, res) {
    return data
      ? res.render(template, data)
      : res.render(template);
  };
};

/*
 * Returns a function that redirects the response to the named URI
 * with the optional HTTP status code.
 */
var redirect = function(uri, status) {
  return function(req, res) {
    return res.redirect(status || 302, uri);
  };
};

var api = function(source, config) {
  if (!config) config = {};
  var formats = Array.isArray(config.format)
    ? config.format
    : config.format ? [config.format] : [];
  return function(req, res) {
    var data = res.locals[source];
    if (!data) {
      return res.send(500, 'No such key: "' + source + '"');
    }
    var format = req.path.split('.').pop();
    if (format && formats.length && formats.indexOf(format) === -1) {
      return res.send(404, 'Bad data format: "' + format + '"');
    } else if (!format) {
      format = formats[0];
    }

    if (config.key) {
      data = dl.accessor(config.key)
        .call(req.params, data);
    }

    if (config.filter === true) {
      var filter = createFilter(req.query);
      data = data.filter(filter);
    } else if (typeof config.filter === 'function') {
      var filter = config.filter;
      var query = res.query;
      return data.filter(function(d, i) {
        return filter.call(query, d, i);
      });
    }

    if (format === 'json') {
      return res.json(data);
    }

    var stringify = tito.formats.createWriteStream(format);
    // res.set('content-type', 'text/' + format);
    return streamify(data)
      .pipe(stringify)
      .pipe(res);
  };
};

module.exports = {
  view: view,
  redirect: redirect,
  api: api
};

function createFilter(query) {
  return function(d) {
    for (var k in query) {
      if (d[k] != query[k]) return false;
    }
    return true;
  };
}
