(function() {
  'use strict';
  angular.module('app.common').service('commonModal', commonModal);

  commonModal.$inject = ['$modal'];
  function commonModal($modal) {
    var modalDefaults = {
      backdrop: true,
      keyboard: true,
      modalFade: true,
      templateUrl: 'app/modules/common/modal/modal.html'
    };

    var modalOptions = {
      closeButtonText: 'Close',
      actionButtonText: 'OK',
      headerText: 'Proceed?',
      bodyText: 'Perform this action?'
    };

    this.show = function(customModalDefaults, customModalOptions) {
      var defaults = {};
      var options = {};

      angular.extend(defaults, modalDefaults, customModalDefaults);
      angular.extend(options, modalOptions, customModalOptions);

      if (!defaults.controller) {
        defaults.controller = defaultModalController(defaults, options);
      }
      return $modal.open(defaults).result;
    };
  }

  function defaultModalController(defaults, options) {
    function controller($scope, $modalInstance) {
      $scope.modalOptions = options;
      $scope.modalOptions.ok = function(result) {
        $modalInstance.close(result);
      };
      $scope.modalOptions.close = $scope.modalOptions.close || function(result) {
        $modalInstance.dismiss('cancel');
      };
    };
    controller.$inject = ['$scope', '$modalInstance'];
    return controller;
  }
})();
