var gulp = require('gulp'),
    webpack = require('webpack'),
    webpackCfg = require('./config/webpack'),
    gutil = require('gulp-util'),
    gData = require('gulp-data'),
    jade = require('gulp-jade'),
    compass = require('gulp-compass'),
    WebpackDevServer = require('webpack-dev-server'),
    constants = require('./config/constants'),
    request = require('request');

// Webpack compiler & its config.
//
var compiler = webpack(webpackCfg),
    // Instantiate server only in development mode,
    // otherwise gulp would not terminate itself after performing all tasks
    server = isProduction() ? {} : new WebpackDevServer(compiler, {
      contentBase: './',
      publicPath: '/assets/'
    }),
    webpackStats;

// Runs webpack compiler and generates javascript files.
//
gulp.task('webpackCompile', function(cb){
  compiler.run(function(err, stats){
    if(err){
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', ""+stats);

    webpackStats = stats;
    cb();
  });
});

// Starts a Webpack dev server, which watch file changes,
// re-compiles in memory (so no actual file is generated) and reloads the browser
// as needed.
//
gulp.task('devServer', function(cb){
  server.listen(8080, "0.0.0.0", function(err){
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
  });
});

// Jade compilation
//
gulp.task('jade', function(){
  return gulp.src('src/jade/index.jade')
    .pipe(jade({
      pretty: true,
      locals: {
        hash: 'main',
        totalPoints: constants.TOTAL_POINTS,
        totalUsers: constants.TOTAL_USERS
      }
    }))
    .pipe(gulp.dest('./'))
    .on('end', forceReload);
});

// Jade compilation with webpack compilation stats
//
gulp.task('jadeProduction', ['webpackCompile', 'compass'], function(){
  return gulp.src('src/jade/index.jade')
    .pipe(gData(populateLocals))
    .pipe(jade({
      pretty: false
    }))
    .pipe(gulp.dest('./'));
});

// Compass compilation
//
gulp.task('compass', function(){
  return gulp.src('src/scss/main.scss')
    .pipe(compass({
      config_file: 'config/compass.rb',
      css: 'assets',
      sass: 'src/scss'
    }))
    .pipe(gulp.dest('./assets'))
    .on('end', forceReload);
});

// Watch file change and invoke corresponding compilers.
//
// Note: This task has nothing to do with browser reload.
//       Browser reload setup is in config/webpack.js.
//
gulp.task('watch', ['jade', 'compass'], function(cb){
  gulp.watch('./src/jade/*', ['jade']);
  gulp.watch('./src/scss/*', ['compass']);
});

gulp.task('default', ['watch', 'devServer']);

gulp.task('build', isProduction() ?
  ['jadeProduction'] : ['webpackCompile', 'jade', 'compass']);

/* Utility functions */

function forceReload() {
  if(isProduction()) {
    return;
  }

  // Force browser reload by hacking webpack-dev-server
  // (using non-public api)
  if(server.io){
    gutil.log('[forceReload] Reloading...')
    server.io.sockets.emit('ok');
  }else{
    throw new gutil.PluginError("forceReload", "webpack-dev-server socket is not ready");
  }
}

function populateLocals(file, cb){
  request(constants.API_ENDPOINT, function(err, resp, data){
    if(err){
      throw new gutil.PluginError("populateLocals", err);
    }

    var hasParseError = false;
    try{
      data = JSON.parse(data);
    } catch(e) {
      gutil.beep();
      gutil.log('[populateLocals]', 'Parse error on data:', e);
      gutil.log('[populateLocals]', 'Data:', data);
      hasParseError = true;
    }


    if(!hasParseError && resp.statusCode === 200){
      gutil.log('[populateLocals]', 'Fetched data:', data);

      cb(null, {
        totalPoints: data.total_points,
        totalUsers: data.total_users,
        hash: webpackStats.hash
      });

    } else {
      gutil.log('[populateLocals]', 'Fallback to manual setup:', {
        totalPoints: constants.TOTAL_POINTS,
        totalUsers: constants.TOTAL_USERS
      });

      cb(null, {
        totalPoints: constants.TOTAL_POINTS,
        totalUsers: constants.TOTAL_USERS,
        hash: webpackStats.hash
      });
    }
  });
}

function isProduction() {
  return process.env.NODE_ENV === 'production';
}
