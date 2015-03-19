(function() {
  'use strict';

  angular.module('app.profile')
    .controller('LoginController', loginController)
    .run(runAuth);

  loginController.$inject = ['authenticationService'];
  function loginController(
    authenticationService
    ) {
    var vm = this;
    vm.user = {};
    vm.responseErrorMsg = '';

    this.login = function() {
      authenticationService.login(vm.user)
        .then(null, function(err) {
          vm.responseErrorMsg = err.data.message;
        });
    }
  }

  runAuth.$inject = ['$rootScope', '$state', 'authenticationService'];
  function runAuth($rootScope, $state, authenticationService) {
    $rootScope.logout = authenticationService.logout;
    $rootScope.$on('$userLoggedIn', function() {
      $state.go('app.dashboard');
    });
    $rootScope.$on('$userLoggedOut', function() {
      $state.go('login');
    });
  }
})();
