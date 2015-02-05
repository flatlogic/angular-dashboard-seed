/*jshint unused:false */

/***************

 This file allow to configure a proxy system plugged into BrowserSync
 in order to redirect backend requests while still serving and watching
 files from the web project

 IMPORTANT: The proxy is disabled by default.

 If you want to enable it, watch at the configuration options and finally
 change the `module.exports` at the end of the file

 ***************/

'use strict';

var httpProxy = require('http-proxy');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

//ServiceNow API authentication
var snConfig = '../srv.conf.js';
var srv = require(snConfig);

var proxyTarget = 'http://' + srv.config.instance;

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

var proxyMiddleware = function(req, res, next) {
  if (req.url.indexOf('api') != -1) {
    proxy.web(req, res);
  } else {
    next();
  }
};

/*
 * This is where you activate or not your proxy.
 *
 * The first line activate if and the second one ignored it
 */

module.exports = [proxyMiddleware];
//module.exports = [];
