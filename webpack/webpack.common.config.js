const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin')

const BUILD_DIR = path.resolve(__dirname, '..', 'app')
const APP_DIR = path.resolve(__dirname, '..', 'src')

const config = {
  entry: {
    vendor: ['jquery', 'foundation-sites'],
    app: ['babel-polyfill', APP_DIR]
  },
  output: {
    path: BUILD_DIR,
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: APP_DIR,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        include: APP_DIR,
        loader: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => ([
                  require('autoprefixer')()
                ])
              }
            },
            'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        include: '/',
        loader: ExtractTextPlugin.extract({
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => ([
                  require('autoprefixer')()
                ])
              }
            }
          ],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(pug$|jade)$/,
        include: APP_DIR,
        loader: 'pug-loader'
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=10000'
      }
    ]
  },
  plugins : [
    new ExtractTextPlugin("css/[name].css"),
    new HtmlWebpackPlugin({
      template: APP_DIR + '/index.pug',
      title: 'TileStyling',
      inject: 'body'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: ({resource}) => (
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
      )
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          failOnWarning: false,
          failOnError: true,
          fix: true
        }
      }
    }),
    new webpack.ProvidePlugin({
	     $: 'jquery',
       jQuery: 'jquery'
    })
  ]
}

module.exports = config
