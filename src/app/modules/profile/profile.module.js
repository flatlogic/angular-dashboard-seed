(function() {
  'use strict';

  var module = angular.module('app.profile', ['ui.router']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function appConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('root.login', {
        url: '/login',
        templateUrl: 'app/modules/profile/login/login.html',
        controller: 'LoginController as vm'
      })
      .state('root.logout', {
        url: '/logout',
        onEnter: ['$http', '$state', function($http, $state) {
          $http.get('/api/logout', this.user)
            .success(function(data) {
              $state.go('root.login');
            })
            .error(function(err) {
              console.log(err);
            });
        }]
      })
      .state('root.profile', {
        url: '/profile',
        templateUrl: 'app/modules/profile/profile/profile.html',
        controller: 'ProfileController as vm'
      });

    $urlRouterProvider.otherwise('');
  }
})();
