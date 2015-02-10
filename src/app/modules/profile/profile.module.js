(function() {
  'use strict';

  var module = angular.module('app.profile', ['ui.router']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function appConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/modules/profile/login/login.html',
        controller: 'LoginController as vm'
      })
      .state('logout', {
        url: '/logout',
        onEnter: ['$http', '$state', function($http, $state) {
          $http.get('/api/logout', this.user)
            .success(function(data) {
              $state.go('login');
            })
            .error(function(err) {
              console.log(err);
            });
        }]
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'app/modules/profile/profile/profile.html',
        controller: 'ProfileController as vm'
      });

    $urlRouterProvider.otherwise('');
  }
})();
