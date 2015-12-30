var webpack = require('webpack'),
	minify = process.env.NODE_ENV !== 'dev';
module.exports = {

  entry: {
  	'main.min': './js/main.js',
  	'narrative.min': './js/narrative.js',
  	'explore.min': './js/explore.js',
  },
  devtool: 'source-map',
  output: {
    path: './js/lib',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  plugins: minify ? [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ] : []

};
