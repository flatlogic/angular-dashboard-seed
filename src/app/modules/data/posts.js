(function() {
  'use strict';

  angular.module('app.data')
    .factory('postResource', postResource)
    .factory('postsUtils', postsUtils);

  postResource.$inject = ['$resource'];

  function postResource($resource) {
    return $resource('/api/posts/:id', {id: '@id'}, {
      update: {
        method: 'PUT'
      }
    });
  }

  postsUtils.$inject = ['postResource'];
  function postsUtils(postResource) {
    function postsDuringInterval(days) {
      return postResource.query().$promise
        .then(function(posts) {
          var today = new Date();
          var interval = 86400000 * days;
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

    function recent(postsNum) {
      return postResource.query().$promise
        .then(function(posts) {
          posts.sort(function (a, b) {
            if (a.date < b.date) return 1;
            else if (a.date == b.date) return 0;
            else return -1;
          });
          return posts.slice(0, postsNum || 1);
        });
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
      lastEdited: lastEdited,
      recent: recent
    }
  }
})();
