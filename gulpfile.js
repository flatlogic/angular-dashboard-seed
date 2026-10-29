'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

['wiredep', 'data', 'build', 'watch', 'server', 'e2e-tests', 'unit-tests', 'deploy'].forEach(function(taskFile) {
    require('./build/' + taskFile);
});

gulp.task('default', gulp.series('clean', 'build'));

gulp.task('help', $.taskListing);
