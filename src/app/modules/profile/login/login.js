(function() {
  'use strict';

  angular.module('app.profile')
    .controller('LoginController', loginController);

  loginController.$inject = ['$http', '$state', '$scope', 'session'];
  function loginController(
    $http,
    $state,
    $scope,
    session
    ) {
    var vm = this;
    vm.user = {};
    vm.responseErrorMsg = '';
    this.login = function() {
      return $http.post('/api/login', this.user)
        .success(function(data) {
          session.setCurrentUser(data);
          $state.go('app.profile');
        })
        .error(function(err) {
          vm.responseErrorMsg = err.message;
        });
    };
  };
})();
