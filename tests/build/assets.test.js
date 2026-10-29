'use strict';

var assert = require('node:assert/strict');
var fs = require('node:fs');
var path = require('node:path');
var test = require('node:test');

test('bundles templates under the relative URLs used by UI Router', function() {
    var templates = fs.readFileSync('.tmp/inject/templateCacheHtml.js', 'utf8');
    ['app/modules/profile/auth/login.html', 'app/modules/core/app.html',
        'app/modules/dashboard/dashboard.html'].forEach(function(url) {
        assert.ok(templates.includes('$templateCache.put("' + url + '"'), 'Missing cached template: ' + url);
    });
    assert.ok(!templates.includes('$templateCache.put("/'), 'Template URLs must not start with a slash');
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
