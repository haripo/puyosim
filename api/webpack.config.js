const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '../');

const babelLoaderConfiguration = {
  test: /\.[jt]sx?$/,
  include: [
    path.resolve(appDirectory, 'index.api.js'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      presets: ['stage-0']
    }
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
        outDir: "web/build",
        lib: ["dom", "ES2017"],
      }
    }
  }
};

module.exports = {
  entry: [path.resolve(appDirectory, 'index.api.js'), 'babel-polyfill'],
  output: {
    filename: 'bundle.api.js',
    path: path.resolve(appDirectory, 'api/build')
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      tsLoaderConfiguration
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      __DEV__: process.env.NODE_ENV === 'production' || true
    })
  ],
  resolve: {
    extensions: ['.web.js', '.js', '.ts', '.tsx', '.web.ts', '.web.tsx']
  },
  devServer: {
    contentBase: path.resolve(appDirectory, 'api/'),
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map'
};