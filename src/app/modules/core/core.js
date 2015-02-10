(function() {
  'use strict';

  angular
    .module('app.core')
    .controller('App', AppController);

  AppController.$inject = ['config', '$scope', '$http'];

  function AppController(config, $scope, $http) {
    /*jshint validthis: true */
    var vm = this;

    vm.title = config.appTitle;

    $scope.app = config;
    $scope.currentUser = null;
    $scope.setCurrentUser = function(user) {
      $scope.currentUser = user;
    };

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $scope.loginPage = toState.name == 'login';
      $(document).trigger('sn:loaded', [event, toState, toParams, fromState, fromParams]);
    })

    activate();

    function activate() {
      $http.get('/api/profile')
        .success(function(user) {
          $scope.setCurrentUser(user);
        })
        .error(function(err) {
          console.log(err);
        });
    }
  }
})();
