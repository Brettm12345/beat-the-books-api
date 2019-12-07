const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const WebpackBar = require('webpackbar');
const slsw = require('serverless-webpack');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.json'],
    plugins: [new TsConfigPathsPlugin()]
  },
  output: {
    libraryTarget: 'commonjs',
    path: join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  externals: [nodeExternals(), 'bcrypt'],
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: require.resolve('awesome-typescript-loader'),
        options: {
          transpileOnly: true
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new WebpackBar()]
};
