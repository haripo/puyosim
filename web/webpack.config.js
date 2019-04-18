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
  ],
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      plugins: [
        'react-native-web',
        'transform-flow-strip-types',
        // [
        //   'module-alias',
        //   [
        //     { src: path.resolve(appDirectory, 'src/web'), expose: 'specific' }
        //   ]
        // ]
        // Stage 0
        // "@babel/plugin-proposal-function-bind",
        //
        // // Stage 1
        // "@babel/plugin-proposal-export-default-from",
        // "@babel/plugin-proposal-logical-assignment-operators",
        // ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
        // ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
        // ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
        // "@babel/plugin-proposal-do-expressions",
        //
        // // Stage 2
        // ["@babel/plugin-proposal-decorators", { "legacy": true }],
        // "@babel/plugin-proposal-function-sent",
        // "@babel/plugin-proposal-export-namespace-from",
        // "@babel/plugin-proposal-numeric-separator",
        // "@babel/plugin-proposal-throw-expressions",
        //
        // // Stage 3
        // "@babel/plugin-syntax-dynamic-import",
        // "@babel/plugin-syntax-import-meta",
        ["@babel/plugin-proposal-class-properties", { "loose": false }],
        // "@babel/plugin-proposal-json-strings"
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
  }
};


const tsLoaderConfiguration = {
  test: /\.tsx?$/,
  exclude: [
    "/node_modules/"
  ],
  use: {
    loader: 'ts-loader',
    options: {
      compilerOptions: {
        allowJs: true,
        target: "ES5",
        module: "es2015",
        jsx: "react",
        outDir: "web/public",
        lib: ["dom", "ES2017"],
      }
    }
  }
};

module.exports = {
  entry: [path.resolve(appDirectory, 'index.web.js'), '@babel/polyfill'],
  output: {
    filename: 'bundle.web.js',
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
      'react-native': 'react-native-web'
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