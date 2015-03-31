(function() {
  'use strict';

  angular.module('app.dashboard')
    .controller('dashboardController', dashboardController);

  dashboardController.$inject = ['$scope', '$sce', 'posts', 'postsUtils'];
  function dashboardController($scope, $sce, posts, postsUtils) {
    $scope.posts = posts;
    $scope.postsLastMonth = postsUtils.postsDuringInterval(posts, 30);
    $scope.lastEditedPost = postsUtils.lastEdited(posts);
    $scope.postsRecently = postsUtils.recent(posts, 5);
    $scope.alerts = [
      { type: 'warning', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Warning:</span> Best check yo self, you\'re not looking too good.') },
      { type: 'success', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Success:</span> You successfully read this important alert message.') },
      { type: 'info', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Info:</span> This alert needs your attention, but it\'s not super important.') },
      { type: 'danger', msg: $sce.trustAsHtml('<span class="fw-semi-bold">Danger:</span> Change this and that and try again.'
      + '<a class="btn btn-default btn-xs pull-right mr" href="#">Ignore</a>'
      + '<a class="btn btn-danger btn-xs pull-right mr-xs" href="#">Take this action</a>') }
    ];

    $scope.addAlert = function() {
      $scope.alerts.push({type: 'warning', msg: $sce.trustAsHtml('Another alert!')});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }

})();
