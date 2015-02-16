(function() {
  'use strict';

  angular
    .module('app.core')
    .controller('App', AppController)
    .service('ScreenUtils', ScreenUtils);

  AppController.$inject = ['config', '$scope', '$http', 'ScreenUtils'];

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
    });

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

  function ScreenUtils() {
    var screens = {
      'xs-max': 767,
        'sm-min': 768,
        'sm-max': 991,
        'md-min': 992,
        'md-max': 1199,
        'lg-min': 1200
    };

    this.isScreen = function(size){
      var screenPx = window.innerWidth;
      return (screenPx >= screens[size + '-min'] || size == 'xs') && (screenPx <= screens[size + '-max'] || size == 'lg');
    };

    this.getScreenSize = function(){
      var screenPx = window.innerWidth;
      if (screenPx <= screens['xs-max']) return 'xs';
      if ((screenPx >= screens['sm-min']) && (screenPx <= screens['sm-max'])) return 'sm';
      if ((screenPx >= screens['md-min']) && (screenPx <= screens['md-max'])) return 'md';
      if (screenPx >= screens['lg-min']) return 'lg';
    }
  }
})();
