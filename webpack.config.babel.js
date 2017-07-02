import path from 'path';
import process from 'process';

const IS_PRODUCTION = (process.env.NODE_ENV === 'production');

const config = {
  context: path.resolve(__dirname, 'src'),

  entry: {
    'index': ['babel-polyfill', './index.js'],
    'background': ['babel-polyfill', './background.js']
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js']
  },

  module: {
    loaders: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: { failOnError: true }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ],
  },

  devtool: IS_PRODUCTION ? false : 'source-map'
};

export default config;
