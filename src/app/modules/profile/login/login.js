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
    var vm = this;
    vm.user = {};
    vm.responseErrorMsg = '';
    this.login = function() {
      return $http.post('/api/login', this.user)
        .success(function(data) {
          $scope.setCurrentUser(data);
          $state.go('app.profile');
        })
        .error(function(err) {
          vm.responseErrorMsg = err.message;
        });
    };
  };
})();
