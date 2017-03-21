module.exports = {
  devtool: '#cheap-eval-source-map',
  entry: `${__dirname}/demo`,
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
};
