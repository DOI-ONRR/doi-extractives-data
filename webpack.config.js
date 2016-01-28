var webpack = require('webpack');
var branch = process.env.BRANCH;
var minifyBranches = ['master', 'staging', 'js-optimization'];

var plugins = [];
if (minifyBranches.indexOf(branch) > -1) {
  var uglify = new webpack.optimize.UglifyJsPlugin({minimize: true});
  plugins.push(uglify);
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
