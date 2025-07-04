const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // раскомментируй при анализе

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? '/shri2025-task/' : '/',
    clean: true, // очищает dist перед билдом
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff2?|png|jpg|jpeg|gif|svg|avif|webp)$/i,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      filename: 'index.html'
    }),
    ...(isProd ? [new MiniCssExtractPlugin()] : []),
    // new BundleAnalyzerPlugin() // включи если хочешь визуально проанализировать бандл
  ],
  optimization: {
    minimize: isProd,
    usedExports: true, // активирует tree-shaking
    sideEffects: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
          mangle: true,
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  devServer: {
    static: './dist',
    hot: true
  },
  devtool: isProd ? false : 'source-map'
};
