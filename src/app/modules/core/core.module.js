(function() {
  'use strict';

  var core = angular.module('app.core', [
    /*
     * Angular modules
     */
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ui.bootstrap',
    'ui.router'
  ]);

  core.config(appConfig);

  appConfig.$inject = ['$stateProvider'];
  function appConfig($stateProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        template: '<div ui-view></div>'
      });
  }
})();
