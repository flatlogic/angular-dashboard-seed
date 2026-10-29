'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

gulp.task('data', function () {
    var jsonFilter = $.filter('*.json', {restore: true});

    return gulp.src(['data/**/*.*'], {encoding: false})
        .pipe(jsonFilter)
        .pipe($.jsonminify())
        .pipe(jsonFilter.restore)
        .pipe(gulp.dest('dist/data'));
});
