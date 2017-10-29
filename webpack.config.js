const path = require('path');
const webpack = require('webpack');

function getConfig(minified) {
  const config = {
    entry: './lib/ReactCrop',
    output: {
      path: path.join(__dirname, 'dist'),
      library: 'ReactCrop',
      libraryTarget: 'umd',
      filename: 'ReactCrop' + (minified ? '.min' : '') + '.js',
    },
    target: 'web',
    externals: {
      react: 'React',
    },
    module: {
      loaders: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }],
    }
  };

  if (minified) {
    config.plugins = [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
    ];
  }

  return config;
}

module.exports = [
  getConfig(),
  getConfig(true),
];
