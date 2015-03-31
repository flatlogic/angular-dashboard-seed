(function() {
  'use strict';

  angular.module('app.dashboard')
    .directive('widgetStat', widgetStat);

  function widgetStat() {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        'widgetClass': '@',
        'iconClass': '@',
        'iconText': '@'
      },
      templateUrl: 'app/modules/dashboard/widget-stat/widget_stat.html'
    }
  }

})();
