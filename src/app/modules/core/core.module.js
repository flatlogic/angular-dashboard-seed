(function() {
  'use strict';

  var core = angular.module('app.core', [
    /*
     * Angular modules
     */
    'ngResource',
    'ui.router'
  ]);

  core.config(appConfig);

  appConfig.$inject = ['$stateProvider'];
  function appConfig($stateProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/modules/core/app.html'
      });
  }
})();
