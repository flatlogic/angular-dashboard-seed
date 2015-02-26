(function() {
  'use strict';

  var module = angular.module('app.post');

  module.service('deletePostModal', deletePostModal);

  deletePostModal.$inject = ['postResource', 'commonModal'];
  function deletePostModal(postResource, commonModal) {
    var that = this;
    this.modalOptions = {
      closeButtonText: 'Cancel',
      actionButtonText: 'Delete',
      headerText: 'Confirm post deletion',
      bodyText: 'The post will be deleted permanently, do you want to continue?'
    };
    this.modalDefaults = {
      windowClass: 'small-modal'
    }

    this.getDeleteMethod = function(posts) {
      return function(post) {
        commonModal.show(that.modalDefaults,that.modalOptions).then(function() {
          postResource.delete(post, function() {
            var index = posts.indexOf(post);
            posts.splice(index,1);
          });
        });
      };
    }
  }
})();
