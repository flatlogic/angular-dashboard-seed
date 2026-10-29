'use strict';

module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/app/modules/data/data.module.js',
            'src/app/modules/data/posts.js',
            'tests/spec/**/*.spec.js'
        ],
        browsers: ['ChromeHeadless'],
        plugins: ['karma-chrome-launcher', 'karma-jasmine'],
        singleRun: true
    });
};
