const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ],
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.png$/,
        loader: 'file-loader'
      }
    ]
  }
};
