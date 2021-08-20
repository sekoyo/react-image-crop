/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function getConfig(env) {
  const config = {
    mode: env,
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      library: 'ReactCrop',
      libraryTarget: 'umd',
      filename: env === 'production' ? 'ReactCrop.min.js' : 'ReactCrop.js',
      globalObject: 'this',
    },
    target: 'web',
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [env !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      new MiniCssExtractPlugin({ filename: 'ReactCrop.css' }),
    ],
  };

  return config;
}

module.exports = [getConfig('development'), getConfig('production')];
module.exports.getConfig = getConfig;
