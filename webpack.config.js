var webpack = require("webpack");
// webpack.optimize.CommonsChunkPlugin;
var minify = process.env.NODE_ENV !== 'dev';
module.exports = {

  entry: {
  	'bundle.min': "./js/main.js",
  	'narrative.min': "./js/narrative.js"
  },
  devtool: "source-map",
  output: {
    path: "./js",
    filename: "[name].js",
    chunkFilename: "[id].js"
  },
  plugins: minify ? [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ] : []

};
