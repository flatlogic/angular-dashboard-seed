'use strict';

var gulp = require('gulp');
var path = require('path');
var fs = require('node:fs');
var annotate = require('ng-annotate-patched');
var through = require('through2');
var htmlmin = require('gulp-html-minifier-terser');
var ESLint = require('eslint').ESLint;

var sass = require('gulp-sass')(require('sass'));

var $ = require('gulp-load-plugins')();

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

async function analyze() {
    var eslint = new ESLint();
    var results = await eslint.lintFiles(['src/**/*.js']);
    var formatter = await eslint.loadFormatter('stylish');
    var output = formatter.format(results);
    if (output) {
        console.log(output);
    }
    if (results.some(function(result) { return result.errorCount > 0; })) {
        throw new Error('ESLint found errors');
    }
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
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'app',
            base: path.resolve('src')
        }))
        .pipe(gulp.dest('.tmp/inject/'));
}

function html() {
    var htmlFilter = $.filter('*.html', {restore: true});
    var jsFilter = $.filter('**/*.js', {restore: true});
    var cssFilter = $.filter('**/*.css', {restore: true});
    var assetsFilter = $.filter(['**/*.js', '**/*.css'], {restore: true});

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
        .pipe(through.obj(function(file, encoding, done) {
            var result = annotate(file.contents.toString(), {add: true, single_quotes: true});
            if (result.errors) {
                done(new Error(result.errors.join('\n')));
                return;
            }
            file.contents = Buffer.from(result.src);
            done(null, file);
        }))
        .pipe($.uglify({output: {comments: /^!|@license|@preserve|@cc_on/i}}))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.replace(/\.\.\/\.\.\/bower_components\/(?:bootstrap-sass\/assets\/fonts\/bootstrap|font-awesome\/fonts|open-sans\/fonts\/[^/]+)\//g, '../fonts/'))
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(assetsFilter.restore)
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest('dist/'));
}

function images() {
    return gulp.src('src/assets/images/**/*', {encoding: false})
        .pipe(gulp.dest('dist/assets/images/'));
}

function fonts() {
    return gulp.src([
        'bower_components/bootstrap-sass/assets/fonts/bootstrap/*',
        'bower_components/font-awesome/fonts/*',
        'bower_components/open-sans/fonts/**/*.{eot,svg,ttf,woff,woff2}'
    ], {encoding: false})
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts/'));
}

function misc() {
    return gulp.src('src/**/*.ico', {encoding: false})
        .pipe(gulp.dest('dist/'));
}

function clean() {
    return Promise.all(['dist', '.tmp'].map(function(directory) {
        return fs.promises.rm(directory, {recursive: true, force: true});
    }));
}


gulp.task('injector:css:preprocessor', injectScss);
gulp.task('styles', gulp.series('wiredep', injectScss, styles));
gulp.task('injector:css', gulp.series('styles', injectCss));
gulp.task('analyze', analyze);
gulp.task('injector:js', gulp.series('analyze', 'injector:css', injectJs));
gulp.task('partials', partials);
gulp.task('html', gulp.series('injector:js', 'partials', html));
gulp.task('images', images);
gulp.task('fonts', fonts);
gulp.task('misc', misc);
gulp.task('clean', clean);
gulp.task('build', gulp.parallel('html', 'images', 'fonts', 'misc', 'data'));
