'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

gulp.task('data', function () {
    var jsonFilter = $.filter('*.json');

    return gulp.src(['data/**/*.*'])
        .pipe(jsonFilter)
        .pipe($.jsonminify())
        .pipe(jsonFilter.restore())
        .pipe(gulp.dest('dist/data'));
});
