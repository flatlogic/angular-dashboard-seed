(function() {
  var app = angular.module('angular-dashboard-demo-controllers', []);

  app.controller('ApplicationController', ['$scope', function($scope) {
    $scope.setCurrentUser = function(user) {
      $scope.currentUser = user;
    }

    $scope.getCurrentUser = function() {
      return $scope.currentUser;
    }
  }]);

  app.controller('LoginController', ['$http', '$state', '$scope', 'Session',
    function(
    $http,
    $state,
    $scope,
    Session
    ) {
    this.user = {};
    this.login = function() {
      $http.post('/login', this.user)
        .success(function(data) {
          $scope.setCurrentUser(data);
          $state.go('profile');
        })
        .error(function(err) {
          console.log(err);
        });
    }
  }]);

  app.controller('ProfileController', ['$http', '$scope', function($http, $scope) {
    this.user = $scope.getCurrentUser();
  }]);


})();