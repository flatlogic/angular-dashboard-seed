'use strict';

var gulp = require('gulp');
var publish = require('gh-pages').publish;

gulp.task('deploy', gulp.series('build', function(done) {
    publish('dist', {message: 'Update [timestamp] --skip-ci'}, done);
}));
