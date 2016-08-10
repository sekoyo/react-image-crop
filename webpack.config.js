const path = require('path');

module.exports = {
  entry: './lib/ReactCrop.js',
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'ReactCrop',
    libraryTarget: 'commonjs2',
    filename: 'ReactCrop.js',
  },
  externals: {
    'react': 'react',
    'object-assign': 'object-assign',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
    }]
  }
};
