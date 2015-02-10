(function() {
  'use strict';

  var module = angular.module('app.post', ['ui.router', 'ngResource']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.posts', {
        url: '/posts',
        templateUrl: 'app/modules/post/list/posts.html',
        controller: 'PostListController as vm'
      })
      .state('app.post', {
        url: '/posts/:id',
        templateUrl: 'app/modules/post/single/post.html',
        resolve: {
          data: ['$stateParams', 'postResource', function($stateParams, postResource){
            return postResource.get({id: $stateParams.id}).$promise;
          }]
        },
        controller: 'PostController as vm'
      })
      .state('app.createPost', {
        url: '/posts/create',
        templateUrl: 'app/modules/post/single/create_post.html',
        resolve: {
          data: function() { return {}; }
        },
        controller: 'PostController as vm'
      })
  }
})();
