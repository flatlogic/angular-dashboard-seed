(function() {
  'use strict';

  angular.module('app.dashboard')
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['$scope','posts'];
  function dashboardController($scope, posts) {
    $scope.posts = posts;
  }

})();
