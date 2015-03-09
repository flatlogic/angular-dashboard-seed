(function() {
  'use strict';

  var dashboard = angular.module('app.dashboard');

  dashboard.directive('todayPosts', todayPosts);
  dashboard.controller('TodayPostsController', todayPostsController);

  function todayPosts() {
    return {
      restrict: 'EA',
      templateUrl: 'app/modules/dashboard/today_posts/today_posts.html',
      controller: 'TodayPostsController as vm'
    };
  }

  todayPostsController.$inject = ['postsUtils'];
  function todayPostsController(postsUtils) {
    var vm = this;
    vm.posts = [];

    postsUtils.postsDuringInterval(1).then(function(todayPosts) {
      vm.posts = todayPosts;
    });
  }

})();
