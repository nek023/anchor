/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const config = {
  entry: {
    index: './src/index.tsx',
    background: './src/background.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new CopyPlugin(['public'])],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = false
  } else {
    config.devtool = 'inline-source-map'
  }

  return config
}
