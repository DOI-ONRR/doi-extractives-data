var datex = require('data-expression');

var compile = function(template) {
  return function(data) {
    return template.replace(/{{\s*(.+)\s*}}/g, function(_, key) {
      return data.hasOwnProperty(key)
	? data[key]
	: datex(key, data);
    });
  };
};

compile.template = function(template, data) {
  var tmpl = compile(template);
  return tmpl(data);
};

module.exports = compile;
