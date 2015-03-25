(function() {
  'use strict';

  var module = angular.module('app.post', ['ui.router', 'ngResource', 'app.data', 'app.common']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.posts', {
        url: '/posts/:interval',
        templateUrl: 'app/modules/post/list/posts.html',
        resolve: {
          posts: ['$stateParams', 'postsUtils', 'postResource', function($stateParams, postsUtils, postResource) {
            return postResource.query().$promise.then(function(allPosts) {
              return $stateParams.interval ? postsUtils.postsDuringInterval(allPosts, $stateParams.interval) : allPosts;
            });
          }]
        },
        controller: 'PostListController as vm'
      })
      .state('app.editPost', {
        url: '/posts/edit/:id',
        templateUrl: 'app/modules/post/edit/edit.html',
        resolve: {
          data: ['$stateParams', 'postResource', function($stateParams, postResource){
            return $stateParams.id ? postResource.get({id: $stateParams.id}).$promise : {};
          }]
        },
        controller: 'PostController',
        controllerAs: 'vm'
      });
  }
})();
