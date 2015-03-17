'use strict';

var gulp = require('gulp');

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    return gulp.src('src/index.html')
        .pipe(wiredep({
            directory: 'bower_components',
            exclude: [/bootstrap\.css/],
            dependencies: true,
            devDependencies: true
        }))
        .pipe(gulp.dest('src'));
});
