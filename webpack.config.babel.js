import path from 'path';
import webpack from 'webpack';

const env = process.env.NODE_ENV || 'development';

export default {
  context: path.join(__dirname, 'src'),

  entry: {
    'index': ['babel-polyfill', './index.js'],
    'background': './background.js'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['', '.js', 'jsx']
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint'
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      '__ENV__': `'${env}'`,
      '__DEBUG__': (env === 'development')
    })
  ],

  eslint: {
    configFile: './.eslintrc',
    failOnError: true
  }
};
