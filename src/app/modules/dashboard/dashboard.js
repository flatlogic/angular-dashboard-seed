(function() {
  'use strict';

  angular.module('app.dashboard')
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['$scope','posts', 'notificator'];
  function dashboardController($scope, posts, notificator) {
    $scope.posts = posts;
  }

})();
