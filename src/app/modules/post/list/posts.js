(function() {
    'use strict';

    angular
        .module('app.post')
        .controller('PostListController', postListController);

    postListController.$inject = ['posts', 'deletePostModal'];
    function postListController(posts, deletePostModal) {
      var vm = this;
      vm.posts = posts;
      vm.delete = deletePostModal.getDeleteMethod(vm.posts);
    }
})();
