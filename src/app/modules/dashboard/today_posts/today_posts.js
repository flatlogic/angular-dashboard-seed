(function() {
  'use strict';

  var dashboard = angular.module('app.dashboard');

  dashboard.directive('todayPosts', todayPosts);
  dashboard.controller('TodayPostsController', todayPostsController);

  todayPostsController.$inject = ['postResource'];

  function todayPosts() {
    return {
      restrict: 'EA',
      templateUrl: 'app/modules/dashboard/today_posts/today_posts.html',
      controller: 'TodayPostsController as vm'
    };
  }

  function todayPostsController(postResource) {
    var vm = this;
    vm.posts = [];
    vm.delete = function(post) {
      postResource.delete(post, function() {
        var index = vm.posts.indexOf(post);
        vm.posts.splice(index,1);
      });
    };

    postResource.query(function(posts) {
      var today = new Date();
      var oneDay = 86400000;
      posts.forEach(function(post) {
        var postDate = new Date(post.date);
        today - postDate < oneDay && vm.posts.push(post);
      });
    });
  }

})();
