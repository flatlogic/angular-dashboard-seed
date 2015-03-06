(function() {
  'use strict';

  var module = angular.module('app.profile', ['ui.router']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
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
        onEnter: ['$http', '$state', 'notificator', function($http, $state, notificator) {
          $http.get('/api/logout', this.user)
            .success(function(data) {
              $state.go('login');
              notificator.success('Logged out successfully')
            });
        }]
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/modules/profile/edit/edit.html',
        controller: 'ProfileController',
        controllerAs: 'vm'
      });
  }
})();
