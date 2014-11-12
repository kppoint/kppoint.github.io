var webpack = require('webpack');

// Base config
//
var webpackCfg = {
  entry: {
    'main': './src/js/main.js',
  },
  output: {
    path: __dirname + '/assets',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        // https://www.npmjs.org/package/sass-loader
        //
        test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded"
      }
    ],
  },
  plugins: []
};

// Extra plugin definitions

// Watch files that is not required with webpack
// https://github.com/webpack/webpack-dev-server/issues/34
//
function WatchExternalFilesPlugin() {}
WatchExternalFilesPlugin.prototype.apply = function(compiler) {
  compiler.plugin("after-compile", function(compilation, callback) {
    compilation.fileDependencies.push("index.html");
    callback();
  });
};


// Configuration based on environments
//
if(process.env.NODE_ENV === 'production'){
  webpackCfg.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false
  }));
  webpackCfg.output.path = './assets'; // Bug?

}else{
  webpackCfg.plugins.push(new WatchExternalFilesPlugin());
  webpackCfg.debug = true;
  webpackCfg.devtool = '#source-map'
}


module.exports = webpackCfg;