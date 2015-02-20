(function() {
  'use strict';

  angular.module('app.profile')
    .controller('LoginController', loginController);

  loginController.$inject = ['$http', '$state', '$scope']

  function loginController(
    $http,
    $state,
    $scope
    ) {
    this.user = {};
    this.login = function() {
      $http.post('/api/login', this.user)
        .success(function(data) {
          $scope.setCurrentUser(data);
          $state.go('app.profile');
        })
        .error(function(err) {
          console.log(err);
        });
    };
  };
})();
