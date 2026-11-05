(function() {
  'use strict';

  var core = angular.module('app.core', [
    /*
     * Angular modules
     */
    'ngResource',
    'ui.router',
    'ui.router.state.events',
    'ngAnimate',
    'toastr'
  ]);

  core.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
  function appConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/modules/core/app.html'
      });

    $urlRouterProvider.otherwise(function($injector) {
      var $state = $injector.get('$state');
      $state.go('app.dashboard');
    });
  }
})();
