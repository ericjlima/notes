let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'), // Use path.resolve for better readability
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [ // Change "loaders" to "rules"
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'] // Use updated presets
        }
      },
      {
        test: /\.(s*)css$/,
        use: [
          'style-loader',
          'css-loader', // Ensures styles are processed
          'sass-loader' // For SASS support
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Add this loader for images
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]', // Maintain original path and name
              outputPath: 'images/', // Where to output images in the build
              publicPath: 'images/' // Public path for resolving image URLs
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'BITBOX',
      template: 'src/index.html',
      filename: 'index.html'
    })
  ]
};

