(function() {
  'use strict';

  angular
    .module('app.core')
    .controller('App', AppController);

  AppController.$inject = ['config', '$scope', '$state', '$rootScope', 'shortHistory', 'authorize', 'session'];
  function AppController(config, $scope, $state, $rootScope, shortHistory, authorize, session) {
    /*jshint validthis: true */
    var vm = this;

    vm.title = config.appTitle;

    $scope.app = config;
    $scope.$state = $state;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      authorize.checkAccess(event, toState, toParams);
    });

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      $('body').toggleClass('nav-shown', false); //TODO: shitty, change later (all the callback, by the way :) )
    });

    $rootScope.$on('$userSet', function(event, user) {
      vm.currentUser = user;
    });

    shortHistory.init($scope);
  }

})();
