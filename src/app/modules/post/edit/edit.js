(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('PostController', postController);

  postController.$inject = ['data', 'postResource', '$state', 'shortHistory'];
  function postController(data, postResource, $state, shortHistory) {
    this.post = data;
    this.showReturnBtn = this.post.id && shortHistory.from.state.name;

    this.update = function() {
      postResource.update(this.post);
    };

    this.return = function() {
        $state.go(shortHistory.from.state.name, shortHistory.from.params);
    };

    this.save = function() {
      this.post.date = (new Date()).toISOString();
      postResource.save(this.post, function(savedPost) {
        shortHistory.goTo('from');
      });
    };
  }

})();
