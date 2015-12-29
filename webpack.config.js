var webpack = require("webpack");
var minify = false;
module.exports = {

  entry: "./js/main.js",
  devtool: "source-map",
  output: {
    path: "./js",
    filename: "bundle.min.js"
  },
  plugins: minify ? [
    new webpack.optimize.UglifyJsPlugin({minimize: false})
  ] : []
};
