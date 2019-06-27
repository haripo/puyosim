const path = require('path');
const nodeExternals = require('webpack-node-externals');

const appDirectory = path.resolve(__dirname);

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]'
    }
  }
};

const tsLoaderConfiguration = {
  test: /\.tsx?$/,
  exclude: [
    "/node_modules/"
  ],
  use: {
    loader: 'ts-loader'
  }
};

module.exports = {
  target: 'node',
  devtool: 'inline-source-map',
  entry: [path.resolve(appDirectory, 'src/index.ts')],
  output: {
    filename: 'index.js',
    path: path.resolve(appDirectory, 'lib'),
    libraryTarget: 'this'
  },
  module: {
    rules: [
      tsLoaderConfiguration,
      imageLoaderConfiguration,
    ]
  },
  externals: [
    nodeExternals()
  ],
  resolve: {
    extensions: ['.js', '.ts']
  },
  optimization: {
    minimize: false,
  }
};