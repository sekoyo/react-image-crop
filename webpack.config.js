const path = require('path');

module.exports = {
  entry: './lib/ReactCrop',
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'ReactCrop',
    libraryTarget: 'commonjs2',
    filename: 'ReactCrop.js',
  },
  externals: {
    react: 'react',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
};
