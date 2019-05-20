module.exports = {
  mode: 'development',
  entry: `${__dirname}/demo`,
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader',
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
};
