const { CheckerPlugin } = require('awesome-typescript-loader');
const slsw = require('serverless-webpack');
const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.json'],
    alias: {
      '@generated': join(__dirname, '/src', 'generated'),
      '@util': join(__dirname, '/src', 'util'),
      '@context': join(__dirname, '/src', 'context.ts')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  externals: [nodeExternals()],
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: require.resolve('awesome-typescript-loader'),
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new CheckerPlugin()]
};
