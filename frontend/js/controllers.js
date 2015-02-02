(function() {
  var app = angular.module('angular-dashboard-demo-controllers', []);

  app.controller('ApplicationController', ['$scope', '$http', function($scope, $http) {
    $scope.currentUser = null;

    $scope.setCurrentUser = function(user) {
      $scope.currentUser = user;
    };

    $http.get('/profile')
      .success(function(user) {
        $scope.setCurrentUser(user);
      })
      .error(function(err) {
        console.log(err);
      })

  }]);

  app.controller('LoginController', ['$http', '$state', '$scope',
    function(
    $http,
    $state,
    $scope
    ) {
    this.user = {};
    this.login = function() {
      $http.post('/login', this.user)
        .success(function(data) {
          $scope.setCurrentUser(data);
          $state.go('profile');
        })
        .error(function(err) {
          console.log(err);
        });
    }
  }]);

  app.controller('ProfileController', ['$http', '$scope', function($http, $scope) {
    this.user = JSON.parse(JSON.stringify($scope.currentUser));

    this.update = function() {
      $http.put('/profile', this.user)
        .success(function(data) {
          $scope.setCurrentUser(data);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    this.cancel = function() {
      this.user = JSON.parse(JSON.stringify($scope.currentUser));
    }
  }]);

  app.controller('PostsController', ['Post', function(Post) {
    this.posts = Post.query();
  }]);

  app.controller('PostController', ['data', 'Post', '$state', function(data, Post, $state) {
    var defaultPost = JSON.parse(JSON.stringify(data));
    this.post = data;

    this.update = function() {
      Post.update(this.post);
      defaultPost = JSON.parse(JSON.stringify(this.post));
    }

    this.cancel = function() {
      this.post = JSON.parse(JSON.stringify(defaultPost));
    }

    this.delete = function() {
      Post.delete(this.post, function() {
        $state.go('posts')
      })
    }

    this.save = function() {
      Post.save(this.post, function(savedPost) {
        $state.go('post', {id: savedPost.id});
      })
    }
  }]);

})();