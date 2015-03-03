(function() {
  'use strict';

  var module = angular.module('app.profile', ['ui.router']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function appConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        data: {
          noAuth: true
        },
        templateUrl: 'app/modules/profile/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout',
        data: {
          noAuth: true
        },
        onEnter: ['$http', '$state', function($http, $state) {
          $http.get('/api/logout', this.user)
            .success(function(data) {
              $state.go('login');
            });
        }]
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/modules/profile/profile/profile.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('');
  }
})();
