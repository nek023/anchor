/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

const config = {
  entry: {
    background: './src/background/index.ts',
    renderer: './src/renderer/index.tsx',
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
    extensions: ['.js', '.ts', '.tsx'],
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
