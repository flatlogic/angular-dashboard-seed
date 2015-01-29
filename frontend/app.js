(function() {

  var app = angular.module('angular-dashboard-demo', ['ui.router',
    'angular-dashboard-demo-controllers',
    'angular-dashboard-demo-services'
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/landing');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginController as vm'
      })
      .state('logout', {
        url: '/logout',
        onEnter: ['$http', '$state', function($http, $state) {
          $http.get('/logout', this.user)
            .success(function(data) {
              $state.go('landing');
            })
            .error(function(err) {
              console.log(err);
            });
        }]
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileController as vm'
      })
      .state('landing', {
        url: '/landing',
        templateUrl: 'views/landing.html'
      });
  }]);

})();