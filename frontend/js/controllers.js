(function() {
  var app = angular.module('angular-dashboard-demo-controllers', []);

  app.controller('ApplicationController', ['$scope', '$http', function($scope, $http) {
    $scope.currentUser = null;

    $scope.setCurrentUser = function(user) {
      $scope.currentUser = user;
    }

    $http.get('/profile')
      .success(function(user) {
        $scope.setCurrentUser(user);
      })
      .error(function(err) {
        console.log(err);
      })

  }]);

  app.controller('LoginController', ['$http', '$state', '$scope',
    function(
    $http,
    $state,
    $scope
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
    var user = $scope.currentUser;
    this.setDefaultProfileInfo = function() {
      this.profileInfo = {
        email: user.email,
        username: user.username,
        password: '',
        newPassword: ''
      };
    }

    this.save = function() {
      $http.put('/profile', this.profileInfo)
        .success(function(data) {
          console.log(data);
        })
        .error(function(err) {
          console.log(err);
        });
    }

    this.setDefaultProfileInfo();
  }]);


})();