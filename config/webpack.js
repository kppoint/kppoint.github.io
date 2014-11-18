var webpack = require('webpack');

// Base config
//
var webpackCfg = {
  entry: {
    'main': './src/js/main.js',
  },
  output: {
    path: __dirname + '/assets',
    filename: 'main.js'
  },
  plugins: [
  ]
};


// Configuration based on environments
//
if(process.env.NODE_ENV === 'production'){
  webpackCfg.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false
  }));
  // webpackCfg.output.path = './assets'; // Bug?
  webpackCfg.output.filename = '[hash].js' // hash filename, cache busting
}else{
  webpackCfg.debug = true;
  webpackCfg.devtool = '#source-map'
}

module.exports = webpackCfg;