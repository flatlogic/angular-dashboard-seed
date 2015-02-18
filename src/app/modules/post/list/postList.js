(function() {
    'use strict';

    angular
        .module('app.post')
        .controller('PostListController', postListController);

    postListController.$inject = ['postResource'];

    function postListController(postResource) {
      var vm = this;
      vm.delete = function(post) {
        postResource.delete(post, function() {
          var index = vm.posts.indexOf(post);
          vm.posts.splice(index,1);
        });
      };
      vm.posts = postResource.query();
    }
})();
