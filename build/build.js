'use strict';

var gulp = require('gulp');
var path = require('path');

var sass = require('gulp-sass')(require('sass'));

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

function styles() {
    return gulp.src(['src/app/index.scss'])
        .pipe(sass({
            style: 'expanded',
            silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div', 'legacy-js-api']
        }))
        .pipe($.autoprefixer({
            overrideBrowserslist: ['last 1 version']
        }))
        .pipe(gulp.dest('.tmp/app/'));
}

function injectScss() {
    return gulp.src('src/app/index.scss')
        .pipe($.inject(gulp.src([
            'src/{app,components}/**/*.scss',
            '!src/app/index.scss',
            '!src/app/theme/*.scss'
        ], {read: true}), {
            transform: function (filePath) {
                filePath = filePath.replace('src/app/', '');
                filePath = filePath.replace('src/components/', '../components/');
                return '@import \'' + filePath + '\';';
            },
            starttag: '// injector',
            endtag: '// endinjector',
            addRootSlash: false
        }))
        .pipe(gulp.dest('src/app/'));
}

function injectCss() {
    return gulp.src('src/index.html')
        .pipe($.inject(gulp.src([
            '.tmp/{app,components}/**/*.css',
            '!.tmp/app/theme/*.css'
        ], {read: false}), {
            ignorePath: '.tmp',
            addRootSlash: false
        }))
        .pipe(gulp.dest('src/'));
}

function jshint() {
    return gulp.src('src/{app,components}/**/*.js')
        .pipe($.jshint('./.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'));
}

function jscs() {
    return gulp.src('src/{app,components}/**/*.js')
        .pipe($.jscs('./.jscsrc'));
}


function injectJs() {
    return gulp.src('src/index.html')
        .pipe($.inject(
            gulp.src([
                'src/{app,components}/**/*.js',
                '!src/{app,components}/**/*.spec.js',
                '!src/{app,components}/**/*.mock.js'
            ])
                .pipe($.angularFilesort()), {
                ignorePath: 'src',
                addRootSlash: false
            }))
        .pipe(gulp.dest('src/'));
}

function partials() {
    return gulp.src('src/{app,components}/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'app',
            base: path.resolve('src')
        }))
        .pipe(gulp.dest('.tmp/inject/'));
}

function html() {
    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assetsFilter = $.filter(['**/*.js', '**/*.css']);

    return gulp.src('src/*.html')
        .pipe($.inject(gulp.src('.tmp/inject/templateCacheHtml.js', {read: false}), {
            starttag: '<!-- inject:partials -->',
            ignorePath: '.tmp',
            addRootSlash: false
        }))
        .pipe($.useref())
        .pipe(assetsFilter)
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate({
            add: true,
            single_quotes: true
        }))
          .pipe($.uglify({output: {comments: $.uglifySaveLicense}}))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.replace(/\.\.\/\.\.\/bower_components\/(?:bootstrap-sass\/assets\/fonts\/bootstrap|font-awesome\/fonts|open-sans\/fonts\/[^/]+)\//g, '../fonts/'))
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assetsFilter.restore())
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest('dist/'))
        .pipe($.size({title: 'dist/', showFiles: true}));
}

function images() {
    return gulp.src('src/assets/images/**/*')
        .pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/images/'));
}

function fonts() {
    return gulp.src([
        'bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
        'bower_components/font-awesome/fonts/*',
        'bower_components/open-sans/fonts/**/*.{eot,svg,ttf,woff,woff2}'
    ])
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts/'));
}

function misc() {
    return gulp.src('src/**/*.ico')
        .pipe(gulp.dest('dist/'));
}

function clean(done) {
    $.del(['dist/', '.tmp/'], done);
}


gulp.task('injector:css:preprocessor', injectScss);
gulp.task('styles', gulp.series('wiredep', injectScss, styles));
gulp.task('injector:css', gulp.series('styles', injectCss));
gulp.task('jshint', jshint);
gulp.task('jscs', jscs);
gulp.task('analyze', gulp.parallel('jshint', 'jscs'));
gulp.task('injector:js', gulp.series('analyze', 'injector:css', injectJs));
gulp.task('partials', partials);
gulp.task('html', gulp.series('injector:js', 'partials', html));
gulp.task('images', images);
gulp.task('fonts', fonts);
gulp.task('misc', misc);
gulp.task('clean', clean);
gulp.task('build', gulp.parallel('html', 'images', 'fonts', 'misc', 'data'));
