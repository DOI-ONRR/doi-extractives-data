module.exports = function(transform) {
  return function(model, input) {
    input = transform.call(this, input, model);
    return this.autoParser(input, this.options.models);
  };
};
