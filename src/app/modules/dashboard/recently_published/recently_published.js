(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('recentlyPublishedCtrl', recentlyPublishedCtrl)
    .directive('recentlyPublished', recentlyPublished);

  function recentlyPublished() {
    return {
      restrict: 'A',
      scope: {
        'allPosts': '=posts'
      },
      controller: recentlyPublishedCtrl,
      controllerAs: 'vm',
      templateUrl: 'app/modules/dashboard/recently_published/recently_published.html'
    }
  }

  recentlyPublishedCtrl.$inject = ['$scope','postsUtils'];
  function recentlyPublishedCtrl($scope, postsUtils) {
    var vm = this;
    vm.posts = postsUtils.recent($scope.allPosts, 5);
  }
})();
