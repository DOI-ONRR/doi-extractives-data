var webpack = require('webpack');
var minify = process.env.NODE_ENV !== 'dev';

var plugins = [];
if (minify) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}

module.exports = {

  entry: {
    'main.min': './js/src/main.js',
    'narrative.min': './js/src/narrative.js',
    'explore.min': './js/src/explore.js',
    'homepage.min': './js/src/homepage.js',
  },

  devtool: 'source-map',

  output: {
    path: './js/lib',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },

  plugins: plugins

};
