(function() {
  var app = angular.module('angular-dashboard-demo-controllers', []);

  app.controller('LoginController', ['$http', '$state', function($http, $state) {
    this.user = {};
    this.login = function() {
      $http.post('/login', this.user)
        .success(function(data) {
          $state.go('profile');
        })
        .error(function(err) {
          console.log(err);
        });
    }
  }]);

})();