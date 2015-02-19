(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('PostController', postController);

  postController.$inject = ['data', 'postResource', '$state'];

  function postController(data, postResource, $state) {
    var defaultPost = JSON.parse(JSON.stringify(data));
    this.post = data;

    this.update = function() {
      postResource.update(this.post);
      defaultPost = JSON.parse(JSON.stringify(this.post));
    };

    this.cancel = function() {
      this.post = JSON.parse(JSON.stringify(defaultPost));
    };

    this.delete = function() {
      postResource.delete(this.post, function() {
        $state.go('app.posts');
      });
    };

    this.save = function() {
      this.post.date = (new Date()).toISOString();
      postResource.save(this.post, function(savedPost) {
        $state.go('app.post', {id: savedPost.id});
      });
    };
  }

})();
