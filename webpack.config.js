const path = require('path');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'index': './index.tsx',
    'background': './background.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.devtool = false;
  } else {
    config.devtool = 'inline-source-map';
  }

  return config;
};
