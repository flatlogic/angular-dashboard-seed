(function() {
  'use strict';

  angular.module('app.dashboard')
    .factory('postsUtils', postsUtils);

  postsUtils.$inject = ['postResource'];
  function postsUtils(postResource) {
    function postsDuringInterval(days) {
      return postResource.query().$promise
        .then(function(posts) {
          var today = new Date();
          var interval = 86400000*days;
          var postsDuringInterval = [];
          posts.forEach(function(post) {
            var postDate = new Date(post.date);
            today - postDate < interval && postsDuringInterval.push(post);
          });
          return postsDuringInterval;
        });
    }

    function total() {
      return postResource.query().$promise;
    }

    function lastEdited() {
      return postResource.query().$promise
        .then(function(posts) {
          var lastEdited = posts[0];
          posts.forEach(function(post) {
            lastEdited = lastEdited.date < post.date ? lastEdited : post;
          });
          return lastEdited;
        });
    }

    return {
      postsDuringInterval: postsDuringInterval,
      total: total,
      lastEdited: lastEdited
    }
  }
})();
