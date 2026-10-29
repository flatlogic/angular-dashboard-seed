'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;
var path = require('path');

function runTests(singleRun, done) {
    new Server({
        configFile: path.resolve('karma.conf.js'),
        singleRun: singleRun
    }, function(exitCode) {
        if (exitCode !== 0) {
            return done(new Error('Karma exited with status ' + exitCode));
        }
        done();
    }).start();
}

gulp.task('test', function(done) { runTests(true, done); });
gulp.task('autotest', function(done) { runTests(false, done); });
