'use strict';

var gulp = require('gulp');
var deploy = require('gulp-gh-pages');

gulp.task('deploy', ['build'], function () {
    var options = {
        message: "Update [timestamp] --skip-ci"
    }

    return gulp.src('./dist/**/*')
        .pipe(deploy(options));
});


/*
 Init repository:

 git checkout --orphan gh-pages
 git rm -rf .
 touch README.md
 git add README.md
 git commit -m "Init gh-pages"
 git push --set-upstream origin gh-pages
 git checkout master
 */
