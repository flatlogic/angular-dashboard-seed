(function() {
  'use strict';

  angular
    .module('app.core')
    .controller('App', AppController);

  AppController.$inject = ['config', '$scope', '$rootScope', 'shortHistory', 'authorize'];
  function AppController(config, $scope, $rootScope, shortHistory, authorize) {
    /*jshint validthis: true */
    var vm = this;

    vm.title = config.appTitle;

    $scope.app = config;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      authorize.checkAccess(event, toState, toParams);
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $scope.loginPage = toState.name == 'login';
      $('body').toggleClass('nav-shown', false); //TODO: shitty, change later (all the callback, by the way :) )
      $(document).trigger('sn:loaded', [event, toState, toParams, fromState, fromParams]);
    });

    shortHistory.init($scope);
  }

})();
