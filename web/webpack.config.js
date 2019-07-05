const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '../');

const babelLoaderConfiguration = {
  test: /\.[jt]sx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'src/web'),
    path.resolve(appDirectory, 'src/shared'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/react-native-sentry'),
    path.resolve(appDirectory, 'node_modules/react-native-fs'),
    path.resolve(appDirectory, 'node_modules/react-native-share'),

    // native-base
    path.resolve(appDirectory, 'node_modules/native-base-shoutem-theme'),
    path.resolve(appDirectory, 'node_modules/react-navigation'),
    path.resolve(appDirectory, 'node_modules/react-native-easy-grid'),
    path.resolve(appDirectory, 'node_modules/react-native-drawer'),
    path.resolve(appDirectory, 'node_modules/react-native-safe-area-view'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
    path.resolve(appDirectory, 'node_modules/react-native-keyboard-aware-scroll-view'),
    path.resolve(appDirectory, 'node_modules/react-native-web'),
    path.resolve(appDirectory, 'node_modules/react-native-tab-view'),
    path.resolve(appDirectory, 'node_modules/static-container'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      plugins: [
        'react-native-web',
        'transform-flow-strip-types',
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
      ],
      presets: ['@babel/preset-env']
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
    loader: 'url-loader'
  },
  include: path.resolve(appDirectory, 'node_modules/react-native-vector-icons')
};


const tsLoaderConfiguration = {
  test: /\.tsx?$/,
  exclude: [
    /node_modules/,
    /test\.ts/
  ],
  use: {
    loader: 'ts-loader',
    options: {
      configFile: path.resolve(appDirectory, 'web/tsconfig.json')
    }
  }
};

module.exports = {
  entry: [path.resolve(appDirectory, 'index.web.js'), '@babel/polyfill'],
  output: {
    filename: 'bundle/bundle.web.js',
    path: path.resolve(appDirectory, 'web/public')
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      tsLoaderConfiguration,
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
    extensions: ['.web.js', '.js', '.ts', '.tsx', '.web.ts', '.web.tsx'],
    alias: {
      'react-native-svg': 'react-native-svg-web',
      'react-native': 'react-native-web',
      'react-native/Libraries/Renderer/shims/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
    }
  },
  devServer: {
    contentBase: path.resolve(appDirectory, 'web/public'),
    publicPath: '/',
    historyApiFallback: {
      rewrites: [
        { from: /^\/[sv].*$/, to: '/simulator.html' }
      ]
    }
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map'
};