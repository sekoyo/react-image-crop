module.exports = {
  eval: 'eval-source-map',
  entry: __dirname + '/demo',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  }
};
