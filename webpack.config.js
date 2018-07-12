// jshint node: true
var path = require('path')
var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var env = process.env.NODE_ENV

var cssConfig = {
  entry: {
    components: './css/components.css',
    main: './css/main.scss',
    print: './css/print.scss',
    styleguide: './css/styleguide.scss',
    'styleguide-theme': './css/styleguide-theme.scss',
  },
  output: {
    path: path.join(__dirname, '/public/css'),
    filename: '[name].css',
    chunkFilename: '[id].css',
  },
  module: {
    rules: [
      {
        test: /\.scss|\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                url: false,
              },
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: {
                includePaths: [path.join(__dirname, '_sass')],
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [new ExtractTextPlugin('[name].css')],
}

var imgConfig = {
  entry: './img/img.js',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [{ loader: 'file-loader' }],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'img',
        to: 'img',
      },
    ]),
  ],
}

var jsConfig = {
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
    path: __dirname + '/public/js',
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  plugins: [],
}

if (env === 'production') {
  var uglify = new webpack.optimize.UglifyJsPlugin({ minimize: true })
  jsConfig.plugins.push(uglify)
  jsConfig.devtool = 'source-map'
}

module.exports = [jsConfig, imgConfig, cssConfig]
