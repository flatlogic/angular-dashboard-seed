(function() {
  'use strict';

  angular.module('app.dashboard')
    .directive('dashTopWidget', dashTopWidget);

  dashTopWidget.$inject = ['postsUtils'];
  function dashTopWidget(postsUtils) {

    function list($scope) {
      var utilsMethod = $scope.interval ? 'postsDuringInterval' : 'total';
      postsUtils[utilsMethod]($scope.interval).then(function(posts) {
        $scope.postsNumber = $scope.descriptionTop = posts.length;
      });
    }

    function lastEdited($scope) {
      postsUtils.lastEdited().then(function(lastEdited) {
        $scope.postsNumber = 1;
        $scope.lastEdited = lastEdited;
      });
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
        'linkMsg': '@'
      },
      controller: ['$scope', '$state', function($scope, $state) {
        types[$scope.type || 'list']($scope);
      }],
      templateUrl: 'app/modules/dashboard/top_widgets/dash_top_widget.html'
    }
  }

})();
