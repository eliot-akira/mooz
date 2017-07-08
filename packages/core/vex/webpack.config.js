
const path = require('path')
const webpack = require('webpack')
const thisPackage = require('./package.json')

module.exports = function (env = {}) {

  const { version } = thisPackage

  const config = {
    entry: './src/index',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'vex-' + version + '.js',
      library: 'Vex',
      libraryTarget: 'umd'
    },
    target: 'web',
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.js?$/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'stage-0'],
          plugins: ['add-module-exports']
        }
      }]
    },
    plugins: [new webpack.optimize.UglifyJsPlugin({
      sourceMap: env.production
    })]

  }

  return config
}