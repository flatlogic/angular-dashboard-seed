'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

require('require-dir')('./build');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('help', $.taskListing);
