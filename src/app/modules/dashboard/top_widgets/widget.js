(function() {
  'use strict';

  angular.module('app.dashboard')
    .directive('dashTopWidget', dashTopWidget);

  dashTopWidget.$inject = ['postsUtils'];
  function dashTopWidget(postsUtils) {

    function list($scope) {
      if ($scope.interval) {
        $scope.postsNumber = $scope.descriptionTop = postsUtils.postsDuringInterval($scope.allPosts, $scope.interval).length;
      } else {
        $scope.postsNumber = $scope.descriptionTop = $scope.allPosts.length;
      }
    }

    function lastEdited($scope) {
        $scope.postsNumber = 1;
        $scope.lastEdited = postsUtils.lastEdited($scope.allPosts);
    }

    var types = {
      lastEdited: lastEdited,
      list: list
    };

    return {
      restrict: 'EA',
      scope: {
        'widgetClass': '@',
        'iconClass': '@',
        'descriptionTop': '@',
        'descriptionBottom': '@',
        'widgetSref': '@',
        'type': '@',
        'interval': '@',
        'linkMsg': '@',
        'allPosts': '=posts'
      },
      controller: ['$scope', '$state', function($scope, $state) {
        types[$scope.type || 'list']($scope);
      }],
      templateUrl: 'app/modules/dashboard/top_widgets/dash_top_widget.html'
    }
  }

})();
