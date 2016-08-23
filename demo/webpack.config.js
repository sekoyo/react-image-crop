module.exports = {
  eval: 'eval-source-map',
  entry: `${__dirname}/demo.jsx`,
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
