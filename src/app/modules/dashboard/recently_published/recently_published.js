(function() {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('recentlyPublishedCtrl', recentlyPublishedCtrl)
    .directive('recentlyPublished', recentlyPublished);

  function recentlyPublished() {
    return {
      restrict: 'A',
      scope: {},
      controller: recentlyPublishedCtrl,
      controllerAs: 'vm',
      templateUrl: 'app/modules/dashboard/recently_published/recently_published.html'
    }
  }

  recentlyPublishedCtrl.$inject = ['postsUtils'];
  function recentlyPublishedCtrl(postsUtils) {
    var vm = this;
    postsUtils.recent(5).then(function(posts) {
      vm.posts = posts;
    })
  }
})();
