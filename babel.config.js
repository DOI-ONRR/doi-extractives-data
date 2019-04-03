module.exports = function (api) {
    api.cache(true);
  
    const presets = ["babel-preset-gatsby"];
    const plugins = [
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-object-rest-spread"
      ];
  
    return {
      presets,
      plugins
    };
  }