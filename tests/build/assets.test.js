'use strict';

var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var test = require('node:test');
var vm = require('node:vm');
var execFileSync = require('node:child_process').execFileSync;

test('bundles templates under the relative URLs used by UI Router', function() {
    var templates = fs.readFileSync('.tmp/inject/templateCacheHtml.js', 'utf8');
    var cache = new Map();
    vm.runInNewContext(templates, {
        angular: {module: function(name) {
            assert.equal(name, 'app');
            return {run: function(inject) {
                inject[inject.length - 1]({put: function(url, html) { cache.set(url, html); }});
            }};
        }}
    });
    ['app/modules/profile/auth/login.html', 'app/modules/core/app.html',
        'app/modules/dashboard/dashboard.html'].forEach(function(url) {
        assert.ok(cache.get(url).length > 0, 'Missing cached template: ' + url);
    });
    assert.ok(Array.from(cache.keys()).every(function(url) { return !url.startsWith('/'); }),
        'Template URLs must not start with a slash');
});

test('build output references existing JavaScript and CSS files', function() {
    var html = fs.readFileSync('dist/index.html', 'utf8');
    var assets = Array.from(html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g), function(match) {
        return match[1];
    });
    assert.ok(assets.length >= 3);
    assets.forEach(function(asset) {
        assert.ok(fs.statSync(path.join('dist', asset)).size > 0, 'Empty built asset: ' + asset);
    });
});

test('bundles fonts and styles without requiring Bower at runtime', function() {
    var html = fs.readFileSync('dist/index.html', 'utf8');
    var cssPath = path.join('dist', html.match(/href="([^"]+\.css)"/)[1]);
    var css = fs.readFileSync(cssPath, 'utf8');
    assert.ok(!css.includes('bower_components'), 'Built styles still depend on Bower files');
    assert.ok(!css.includes('@import'), 'Built styles still contain external CSS imports');
    Array.from(css.matchAll(/url\(["']?([^"')]+)["']?\)/g), function(match) {
        return match[1].split(/[?#]/)[0];
    }).filter(function(url) {
        return !url.startsWith('data:') && !url.startsWith('http');
    }).forEach(function(url) {
        assert.ok(fs.statSync(path.resolve(path.dirname(cssPath), url)).size > 0, 'Missing CSS asset: ' + url);
    });
});

test('loads jQuery before Angular so Angular directives retain jQuery plugins', function() {
    var source = fs.readFileSync('src/index.html', 'utf8');
    var jquery = source.indexOf('bower_components/jquery/dist/jquery.js');
    var angular = source.indexOf('bower_components/angular/angular.js');
    assert.ok(jquery !== -1 && angular !== -1);
    assert.ok(jquery < angular, 'Angular would bind jqLite instead of jQuery and lose touchSwipe');
});

test('copies binary fonts without changing their bytes', function() {
    ['bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff',
        'bower_components/font-awesome/fonts/fontawesome-webfont.woff2'].forEach(function(source) {
        var target = path.join('dist/fonts', path.basename(source));
        assert.deepEqual(fs.readFileSync(target), fs.readFileSync(source), 'Binary asset changed: ' + source);
    });
});

test('copies binary image assets without changing their bytes', function(context) {
    var source = 'src/assets/images/__binary-copy-test.png';
    var target = 'dist/assets/images/__binary-copy-test.png';
    var bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 255, 128, 0]);
    context.after(function() {
        fs.rmSync(source, {force: true});
        fs.rmSync(target, {force: true});
    });
    fs.mkdirSync(path.dirname(source), {recursive: true});
    fs.writeFileSync(source, bytes);
    execFileSync(process.execPath, ['node_modules/gulp/bin/gulp.js', 'images']);
    assert.deepEqual(fs.readFileSync(target), bytes);
});
