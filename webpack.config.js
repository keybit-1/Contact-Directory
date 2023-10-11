const path = require('path');

module.exports = {
  mode: 'development',  // <-- Add this line here
  entry: './client/src/index.js', 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '/public')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};

