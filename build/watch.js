'use strict';

var gulp = require('gulp');

gulp.task('watch', gulp.series('injector:js', function(done) {
    gulp.watch('src/{app,components,styles}/**/*.scss', gulp.series('injector:css'));
    gulp.watch('src/{app,components}/**/*.js', gulp.series('injector:js'));
    gulp.watch('src/assets/images/**/*', gulp.series('images'));
    gulp.watch('bower.json', gulp.series('wiredep'));
    done();
}));
