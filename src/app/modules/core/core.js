(function() {
  'use strict';

  angular
    .module('app.core')
    .controller('App', AppController);

  AppController.$inject = ['config', '$scope', '$http', 'shortHistory', 'session', 'auth'];
  function AppController(config, $scope, $http, shortHistory, session, auth) {
    /*jshint validthis: true */
    var vm = this;

    vm.title = config.appTitle;

    $scope.app = config;

    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      auth.checkAccess(event, toState);
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $scope.loginPage = toState.name == 'login';
      $(document).trigger('sn:loaded', [event, toState, toParams, fromState, fromParams]);
    });

    activate();

    function activate() {
      shortHistory.init($scope);
      auth.init('login');
      $http.get('/api/profile')
        .success(function(user) {
          session.setCurrentUser(user);
        });
    }
  }

})();
