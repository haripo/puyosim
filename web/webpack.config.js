const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '../');

const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'src/web'),
    path.resolve(appDirectory, 'src/shared'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      plugins: ['react-native-web', 'transform-flow-strip-types'],
      presets: ['react-native', 'react-native-stage-0']
    }
  }
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]'
    }
  }
};

module.exports = {
  entry: [path.resolve(appDirectory, 'index.web.js'), 'babel-polyfill'],
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist')
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV === 'production' || true
    })
  ],

  resolve: {
    extensions: [ '.web.js', '.js' ]
  },
  devtool: 'inline-source-map'
};