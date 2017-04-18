// jshint node: true
var webpack = require('webpack');
var env = process.env.NODE_ENV;

var config = {

  entry: {
    'main.min': './js/src/main.js',
    'narrative.min': './js/src/narrative.js',
    'explore.min': './js/src/explore.js',
    'homepage.min': './js/src/homepage.js',
    'state-pages.min': './js/src/state-pages.js',
    'company-revenue.min': './js/src/company-revenue.js',
    'reconciliation.min': './js/src/reconciliation.js',
    'search.min': './js/src/search.js',
  },

  output: {
    path: __dirname + '/js/lib',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },

  plugins: []

};

if (env === 'production') {
  var uglify = new webpack.optimize.UglifyJsPlugin({minimize: true});
  config.plugins.push(uglify);
  config.devtool = 'source-map';
}

module.exports = config;
