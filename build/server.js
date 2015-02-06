'use strict';

var gulp = require('gulp');

var util = require('util');
var browserSync = require('browser-sync');
var middleware = require('./proxy');
var nodemon = require('gulp-nodemon');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === 'src' || (util.isArray(baseDir) && baseDir.indexOf('src') !== -1)) {
    routes = {
      // Should be '/bower_components': '../bower_components'
      // Waiting for https://github.com/shakyShane/browser-sync/issues/308
      '/bower_components': 'bower_components',
      '/data': 'data'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
    //logLevel: 'debug'
  });

}

gulp.task('serve', ['watch', 'api'], function () {
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
  ]);
});

gulp.task('api', function() { //TODO: todo ;)
  nodemon({
    script: 'srv/app.js'
  });
});

gulp.task('serve:dist', ['build', 'api'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:e2e', ['wiredep', 'injector:js', 'injector:css'], function () {
  browserSyncInit(['src', '.tmp'], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit('dist', null, []);
});
