'use strict';

var gulp = require('gulp');
var patchInstalledBootstrap = require('./patch-bootstrap.cjs').patchInstalledBootstrap;

// inject bower components
gulp.task('wiredep', gulp.series(patchInstalledBootstrap, function () {
    var wiredep = require('wiredep').stream;

    return gulp.src('src/index.html')
        .pipe(wiredep({
            directory: 'bower_components',
            overrides: {
                angular: {dependencies: {jquery: '*'}}
            },
            exclude: [/bootstrap\.css/],
            dependencies: true,
            devDependencies: true
        }))
        .pipe(gulp.dest('src'));
}));
