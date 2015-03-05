(function() {
  'use strict';

  var core = angular.module('app.core', [
    /*
     * Angular modules
     */
    'ngResource',
    'ui.router',
    'ngAnimate',
    'toastr'
  ]);

  core.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function appConfig($stateProvider, $urlRouterProvider) {
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
