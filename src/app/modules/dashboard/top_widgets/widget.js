(function() {
  'use strict';

  angular.module('app.dashboard')
    .directive('postsListDashWidget', postsListDashWidget)
    .directive('lastEditedDashWidget', lastEditedDashWidget);

  function lastEditedDashWidget() {
    return {
      restrict: 'EA',
      scope: {},
      controller: ['$scope', '$state', 'postsUtils', function ($scope, $state, postsUtils) {
        $scope.lastEdited;

        postsUtils.lastEdited().then(function(lastEdited) {
          $scope.lastEdited = lastEdited;
        });

        vm.action = function() {
          $state.go('app.editPost', {id: vm.lastEdited.id})
        }
      }],
      templateUrl: 'app/modules/dashboard/top_widgets/last_edited.html'
    }
  }

  function postsListDashWidget() {
    return {
      restrict: 'EA',
      scope: {
        'widgetClass': '@',
        'iconClass': '@',
        'description': '@',
        'interval': '@'
      },
      controller: ['$scope', '$state', 'postsUtils', function($scope, $state, postsUtils) {
        var utilsMethod = $scope.interval ? 'postsDuringInterval' : 'total';

        postsUtils[utilsMethod]($scope.interval).then(function(posts) {
          $scope.number = posts.length;
        });

        $scope.action = function() {
          $state.go('app.posts', {interval: $scope.interval})
        }

      }],
      templateUrl: 'app/modules/dashboard/top_widgets/posts_list_widget.html'
    }
  }

})();
