'use strict';

var assert = require('node:assert/strict');
var test = require('node:test');
var zlib = require('node:zlib');
var app = require('../../srv/app');
var auth = require('../../srv/routes/auth');
var server;
var baseUrl;

function cookie(response) {
    return response.headers.get('set-cookie').split(';')[0];
}

function login(sessionCookie, password) {
    return fetch(baseUrl + '/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Cookie: sessionCookie},
        body: JSON.stringify({username: 'user1', password: password})
    });
}

test.before(async function() {
    server = app.listen(0, '127.0.0.1');
    await new Promise(function(resolve) { server.once('listening', resolve); });
    baseUrl = 'http://127.0.0.1:' + server.address().port;
});

test.after(function() {
    return new Promise(function(resolve, reject) {
        server.close(function(err) {
            if (err) { reject(err); } else { resolve(); }
        });
        server.closeAllConnections();
    });
});

test('rejects anonymous requests and incorrect credentials', async function() {
    var anonymous = await fetch(baseUrl + '/api/profile');
    assert.equal(anonymous.status, 401);
    var failedLogin = await login(cookie(anonymous), 'incorrect');
    assert.equal(failedLogin.status, 401);
    assert.equal((await failedLogin.json()).message, 'To login use user1/user1pass');
});

test('rotates sessions on login and logout and invalidates the old cookies', async function() {
    var anonymous = await fetch(baseUrl + '/api/profile');
    var anonymousCookie = cookie(anonymous);
    var loggedIn = await login(anonymousCookie, 'user1pass');
    assert.equal(loggedIn.status, 200);
    var user = await loggedIn.json();
    assert.equal(user.id, 1);
    assert.equal(user.password, undefined);
    var authenticatedCookie = cookie(loggedIn);
    assert.notEqual(authenticatedCookie, anonymousCookie);
    var staleSession = await fetch(baseUrl + '/api/profile', {headers: {Cookie: anonymousCookie}});
    assert.equal(staleSession.status, 401);
    var profile = await fetch(baseUrl + '/api/profile', {headers: {Cookie: authenticatedCookie}});
    assert.equal(profile.status, 200);
    assert.equal((await profile.json()).username, 'user1');
    var posts = await fetch(baseUrl + '/api/posts', {headers: {Cookie: authenticatedCookie}});
    assert.equal(posts.status, 200);
    assert.ok(Array.isArray(await posts.json()));
    var loggedOut = await fetch(baseUrl + '/api/logout', {headers: {Cookie: authenticatedCookie}});
    assert.equal(loggedOut.status, 200);
    assert.deepEqual(await loggedOut.json(), {id: 1});
    assert.notEqual(cookie(loggedOut), authenticatedCookie);
    var expiredSession = await fetch(baseUrl + '/api/profile', {headers: {Cookie: authenticatedCookie}});
    assert.equal(expiredSession.status, 401);
    var newSession = await fetch(baseUrl + '/api/profile', {headers: {Cookie: cookie(loggedOut)}});
    assert.equal(newSession.status, 401);
});

test('forwards asynchronous logout failures without sending success', async function() {
    var logout;
    auth.configure({post: function() {}, get: function(path, handler) { logout = handler; }});
    var failure = new Error('Session store unavailable');
    await new Promise(function(resolve, reject) {
        logout({user: {id: 1}, logout: function(done) {
            setImmediate(function() { done(failure); });
        }}, {send: function() { reject(new Error('Logout sent success despite a session error')); }}, function(err) {
            try { assert.equal(err, failure); resolve(); } catch (error) { reject(error); }
        });
    });
});

test('rejects malformed and oversized JSON and still accepts compressed login requests', async function() {
    var malformed = await fetch(baseUrl + '/api/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{'
    });
    assert.equal(malformed.status, 400);
    var oversized = await fetch(baseUrl + '/api/login', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: 'x'.repeat(110000), password: 'irrelevant'})
    });
    assert.equal(oversized.status, 413);
    var compressed = await fetch(baseUrl + '/api/login', {
        method: 'POST', headers: {'Content-Type': 'application/json', 'Content-Encoding': 'gzip'},
        body: zlib.gzipSync(JSON.stringify({username: 'user1', password: 'user1pass'}))
    });
    assert.equal(compressed.status, 200);
    assert.equal((await compressed.json()).id, 1);
});
