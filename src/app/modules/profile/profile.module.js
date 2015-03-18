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
        templateUrl: 'app/modules/profile/auth/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout',
        data: {
          noAuth: true
        },
        onEnter: ['$http', '$state', 'notificator', 'session', function($http, $state, notificator, session) {
          $http.get('/api/logout', this.user)
            .success(function(data) {
              $state.go('login');
              session.setCurrentUser(null);
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
