(function() {
    'use strict';

    angular
        .module('app.post')
        .controller('PostListController', postListController);

    postListController.$inject = ['postResource', 'deletePostModal'];
    function postListController(postResource, deletePostModal) {
      var vm = this;
      vm.posts = postResource.query();
      vm.delete = deletePostModal.getDeleteMethod(vm.posts);
    }
})();
