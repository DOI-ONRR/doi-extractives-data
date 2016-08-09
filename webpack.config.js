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
    'state-revenue-table.min': './js/src/state-revenue-table.jsx'
  },

  output: {
    path: './js/lib',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loaders: [ 'babel-loader' ]
      }
    ]
  },

  plugins: [],

  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  },

  devtool: 'sourcemap'

};

if (env === 'production') {
  var uglify = new webpack.optimize.UglifyJsPlugin({minimize: true});
  config.plugins.push(uglify);
  config.devtool = 'source-map';
}

module.exports = config;
