(function() {
  'use strict';

  angular.module('app.dashboard')
    .factory('postsUtils', postsUtils);

  postsUtils.$inject = ['postResource'];
  function postsUtils(postResource) {
    function today() {
      return postResource.query().$promise
        .then(function(posts) {
          var today = new Date();
          var oneDay = 86400000;
          var postsToday = [];
          posts.forEach(function(post) {
            var postDate = new Date(post.date);
            today - postDate < oneDay && postsToday.push(post);
          });
          return postsToday;
        });
    }

    function total() {
      return postResource.query().$promise;
    }

    return {
      today: today,
      total: total
    }
  }
})();
