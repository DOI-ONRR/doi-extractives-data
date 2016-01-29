var webpack = require('webpack');
var env = process.env.NODE_ENV;

var config = {

  entry: {
    'main.min': './js/src/main.js',
    'narrative.min': './js/src/narrative.js',
    'explore.min': './js/src/explore.js',
    'homepage.min': './js/src/homepage.js',
  },

  output: {
    path: './js/lib',
    filename: '[name].js',
    chunkFilename: '[id].js'
  }

};

var plugins = [];
if (env === 'production') {
  var uglify = new webpack.optimize.UglifyJsPlugin({minimize: true});
  config.plugins = [uglify];
  config.devtool = 'source-map';
}

module.exports = config;
