(function() {

  var app = angular.module('angular-dashboard-demo', [
    'ui.router',
    'ngResource',
    'angular-dashboard-demo-controllers',
    'angular-dashboard-demo-services'
  ]);

  app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/posts');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginController as vm'
      })
      .state('logout', {
        url: '/logout',
        onEnter: ['$http', '$state', function($http, $state) {
          $http.get('/logout', this.user)
            .success(function(data) {
              $state.go('login');
            })
            .error(function(err) {
              console.log(err);
            });
        }]
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileController as vm'
      })
      .state('posts', {
        url: '/posts',
        templateUrl: 'views/posts.html',
        controller: 'PostsController as vm'
      })
      .state('post', {
        url: '/posts/:id',
        templateUrl: 'views/post.html',
        resolve: {
          data: ['$stateParams', 'Post', function($stateParams, Post){
            return Post.get({id: $stateParams.id}).$promise;
          }]
        },
        controller: 'PostController as vm'
      })
      .state('createPost', {
        url: '/posts/create',
        templateUrl: 'views/create_post.html',
        resolve: {
          data: function() { return {}; }
        },
        controller: 'PostController as vm'
      })
  }]);

})();