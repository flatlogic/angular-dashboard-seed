(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('PostController', postController);

  postController.$inject = ['data', 'postResource', '$state'];

  function postController(data, postResource, $state) {
    var defaultPost = $.extend(true, {}, data);
    this.post = data;

    this.update = function() {
      postResource.update(this.post);
      defaultPost = $.extend(true, {}, this.post);
    };

    this.cancel = function() {
      this.post = $.extend(true, {}, defaultPost);
    };

    this.save = function() {
      this.post.date = (new Date()).toISOString();
      postResource.save(this.post, function(savedPost) {
        $state.go('app.post', {id: savedPost.id});
      });
    };
  }

})();
