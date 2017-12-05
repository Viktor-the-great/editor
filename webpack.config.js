const webpack = require('webpack');
const path = require('path');

const atImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const calc = require('postcss-calc');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const bundlesPath = path.join(__dirname, 'dist');

const postcssPlugins = [
  atImport({
    path: ['src/css'],
  }),
  autoprefixer({ browsers: ['> 5%', 'ie >= 7', 'last 2 versions'] }),
  precss(),
  calc(),
];

const contextPath = path.join(__dirname, 'src');
const sourcePath = path.join(__dirname, 'src/js');
const isProd = process.env.NODE_ENV === 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify(isProd ? 'production' : 'development') }
  }),
  new HtmlWebpackPlugin({
    title: 'Test task',
    template: 'index.html',
    inject: false,
    filename: 'index.html',
  }),
];

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    })
  );
}

module.exports = {
  context: contextPath,
  entry: {
    friends: './js/entry.jsx',
  },
  output: {
    path: bundlesPath,
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins,
  module: {
    rules: [{
      test: [/\.js$/, /\.jsx$/],
      exclude: [
        /node_modules/,
      ],
      use: ['babel-loader'],
    }, {
      test: /\.css$/,
      include: [
        path.resolve(__dirname, 'node_modules')
      ],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: false,
          }
        }
      ],
    }, {
      test: /\.module.css$/,
      include: [
        path.resolve(__dirname, 'src/js')
      ],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: postcssPlugins
          }
        }
      ]
    }, {
      test: /\.css$/,
      include: [
        path.resolve(__dirname, 'src/css')
      ],
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: false,
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: postcssPlugins
          }
        }
      ]
    }, {
      test: [
        /\.(png|ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        /\.(png|gif|cur)/,
      ],
      use: ['file-loader'],
    }],
  },
  resolve: {
    modules: [sourcePath, 'node_modules'],
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      css: path.join(__dirname, 'src/css'),
    },
  },
  devtool: isProd ? false : "cheap-inline-module-source-map",
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
    publicPath: "/",
    open: true,
  }
};