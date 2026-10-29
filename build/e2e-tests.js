'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor(done) {
    var testFiles = [
        'tests/e2e/**/*.js'
    ];

    gulp.src(testFiles)
        .pipe($.protractor.protractor({
            configFile: 'protractor.conf.js'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        })
        .on('end', function () {
            // Close browser sync server
            browserSync.exit();
            done();
        });
}


gulp.task('e2e', gulp.series('serve:e2e', 'webdriver-update', runProtractor));
gulp.task('e2e:dist', gulp.series('serve:e2e-dist', 'webdriver-update', runProtractor));
gulp.task('protractor', gulp.series('e2e'));
