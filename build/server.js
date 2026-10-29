'use strict';

var gulp = require('gulp');

var browserSync = require('browser-sync');
var middleware = require('./proxy');
var nodemon = require('gulp-nodemon');

function browserSyncInit(baseDir, files, browser, done) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === 'src' || (Array.isArray(baseDir) && baseDir.indexOf('src') !== -1)) {
    routes = {
      // Should be '/bower_components': '../bower_components'
      // Waiting for https://github.com/shakyShane/browser-sync/issues/308
      '/bower_components': 'bower_components',
      '/data': 'data'
    };
  }

  browserSync.instance = browserSync.init({
    files: files,
    startPath: '/',
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
    //logLevel: 'debug'
  }, done);

}

gulp.task('api', function(done) {
  nodemon({script: 'srv/app.js'}).once('start', done);
});

gulp.task('serve', gulp.series('watch', 'api', function(done) {
  browserSyncInit([
    'src',
    '.tmp',
    'data'
  ], [
    'data/**/*.*',
    '.tmp/{app,components}/**/*.css',
    'src/assets/images/**/*',
    'src/*.html',
    'src/{app,components}/**/*.html',
    'src/{app,components}/**/*.js'
  ], undefined, done);
}));

gulp.task('serve:dist', gulp.series('build', 'api', function(done) {
  browserSyncInit('dist', undefined, undefined, done);
}));

gulp.task('serve:e2e', gulp.series('injector:js', function(done) {
  browserSyncInit(['src', '.tmp'], null, [], done);
}));

gulp.task('serve:e2e-dist', gulp.series('build', function(done) {
  browserSyncInit('dist', null, [], done);
}));
