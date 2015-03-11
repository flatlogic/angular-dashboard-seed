(function() {
  'use strict';

  angular.module('app.dashboard')
    .controller('postsTotalCtrl', postsTotalCtrl)
    .controller('postsTodayCtrl', postsTodayCtrl)
    .controller('lastEditedCtrl', lastEditedCtrl)
    .controller('postsThisMonthCtrl', postsThisMonthCtrl)
    .directive('postsThisMonth', postsThisMonth)
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

    vm.description = 'total';
    vm.widgetClass = 'posts-total';
    vm.iconClass = 'glyphicon glyphicon-globe';

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

  postsTodayCtrl.$inject = ['postsUtils', '$state'];
  function postsTodayCtrl(postsUtils, $state) {
    var vm = this;

    vm.description = 'today';
    vm.widgetClass = 'posts-today';
    vm.iconClass = 'glyphicon glyphicon-hourglass';
    vm.number = 0;

    vm.action = function() {
      $state.go('app.posts', {interval: 1});
    };

    postsUtils.postsDuringInterval(1).then(function(todayPosts) {
      vm.number = todayPosts.length;
    })
  }

  function postsThisMonth() {
    return {
      restrict: 'EA',
      controller: postsThisMonthCtrl,
      scope: {},
      controllerAs: 'vm',
      templateUrl: 'app/modules/dashboard/top_widget/widget.html'
    }
  }

  postsThisMonthCtrl.$inject = ['postsUtils', '$state'];
  function postsThisMonthCtrl(postsUtils, $state) {
    var vm = this;

    vm.description = 'this month';
    vm.widgetClass = 'posts-this-month';
    vm.iconClass = 'glyphicon glyphicon-calendar';
    vm.number = 0;

    postsUtils.postsDuringInterval(30).then(function(postsThisMonth) {
      vm.number = postsThisMonth.length;
    });

    vm.action = function() {
      $state.go('app.posts', {interval: 30});
    }
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

    vm.description = 'last edited';
    vm.widgetClass = 'last-edited';
    vm.iconClass = 'glyphicon glyphicon-pencil';
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
