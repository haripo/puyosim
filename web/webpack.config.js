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
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
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

const fontLoaderConfiguration = {
  test: /\.ttf$/,
  use: {
    loader: "url-loader"
  }
};

module.exports = {
  entry: [path.resolve(appDirectory, 'index.web.js'), 'babel-polyfill'],
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'web/build')
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      fontLoaderConfiguration
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
  devServer: {
    contentBase: path.resolve(appDirectory)
  },
  devtool: 'inline-source-map'
};