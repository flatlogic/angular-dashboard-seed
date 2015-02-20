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
      .state('app.editPost', {
        url: '/posts/edit/:id',
        templateUrl: 'app/modules/post/edit/edit.html',
        resolve: {
          data: ['$stateParams', 'postResource', function($stateParams, postResource){
            return $stateParams.id ? postResource.get({id: $stateParams.id}).$promise : {};
          }]
        },
        controller: 'PostController as vm'
      });
  }
})();
