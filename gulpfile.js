var gulp = require('gulp'),
    webpack = require('webpack'),
    webpackCfg = require('./config/webpack'),
    gutil = require('gulp-util'),
    WebpackDevServer = require('webpack-dev-server');

// Webpack compiler & its config.
//
var compiler = webpack(webpackCfg);

// Runs webpack compiler and generates javascript files.
//
gulp.task('build', function(cb){
  compiler.run(function(err, stats){
    if(err){
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', ""+stats);
    cb();
  });
});

// Starts a Webpack dev server, which watch file changes,
// re-compiles in memory (so no actual file is generated) and reloads the browser
// as needed.
//
gulp.task('dev', function(cb){
  new WebpackDevServer(compiler, {
    contentBase: './',
    publicPath: '/assets/'
  }).listen(8080, "localhost", function(err){
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
  });
});

gulp.task('default', ['dev']);