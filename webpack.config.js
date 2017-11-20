const path = require('path');
const webpack = require('webpack');

function getConfig(minified) {
  const config = {
    entry: './lib/ReactCrop',
    output: {
      path: path.resolve('dist'),
      library: 'ReactCrop',
      libraryTarget: 'umd',
      filename: minified ? 'ReactCrop.min.js' : 'ReactCrop.js',
    },
    target: 'web',
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
    },
    module: {
      loaders: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }],
    },
  };

  if (minified) {
    config.plugins = [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ];
  }

  return config;
}

module.exports = [
  getConfig(),
  getConfig(true),
];
