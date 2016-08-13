const path = require('path');

module.exports = {
  entry: './lib/ReactCrop.jsx',
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
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel',
    }]
  }
};
