(function() {
  'use strict';

  angular.module('app.dashboard')
    .controller('postsTotalCtrl', postsTotalCtrl)
    .controller('postsTodayCtrl', postsTodayCtrl)
    .controller('lastEditedCtrl', lastEditedCtrl)
    .directive('lastEdited', lastEdited)
    .directive('postsTotal', postsTotal)
    .directive('postsToday', postsToday);

  function postsTotal() {
    return {
      restrict: 'EA',
      controller: postsTotalCtrl,
      scope: {},
      controllerAs: 'vm',
      templateUrl: 'app/modules/dashboard/top_widget/widget.html'
    }
  }

  postsTotalCtrl.$inject = ['postResource', '$state'];
  function postsTotalCtrl(postResource, $state) {
    var vm = this;

    vm.description = 'Posts total';
    vm.widgetClass = 'posts-total';

    postResource.query(function(posts) {
      vm.number = posts.length;
    });
    vm.action = function() {
      $state.go('app.posts')
    };

  }

  function postsToday() {
    return {
      restrict: 'EA',
      controller: postsTodayCtrl,
      scope: {},
      controllerAs: 'vm',
      templateUrl: 'app/modules/dashboard/top_widget/widget.html'
    }
  }

  postsTodayCtrl.$inject = ['postsUtils'];
  function postsTodayCtrl(postsUtils) {
    var vm = this;

    vm.description = 'Posts today';
    vm.widgetClass = 'posts-today';
    vm.number = 0;

    vm.action = function() {

    };

    postsUtils.today().then(function(todayPosts) {
      vm.number = todayPosts.length;
    })
  }

  function lastEdited() {
    return {
      restrict: 'EA',
      controller: lastEditedCtrl,
      scope: {},
      controllerAs: 'vm',
      templateUrl: 'app/modules/dashboard/top_widget/widget.html'
    }
  }

  lastEditedCtrl.$inject = ['postsUtils', '$state'];
  function lastEditedCtrl(postsUtils, $state) {
    var vm = this;

    vm.description = 'Last Edited';
    vm.widgetClass = 'last-edited';
    vm.number = 0;
    vm.lastEdited;

    postsUtils.lastEdited().then(function(lastEdited) {
      vm.lastEdited = lastEdited;
    });

    vm.action = function() {
      $state.go('app.editPost', {id: vm.lastEdited.id})
    }
  }

})();
