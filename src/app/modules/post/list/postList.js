(function() {
    'use strict';

    angular
        .module('app.post')
        .controller('PostListController', postListController);

    postListController.$inject = ['postResource']

    function postListController(postResource) {
      this.posts = postResource.query();
    }
})();
