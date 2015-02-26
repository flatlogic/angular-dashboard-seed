(function() {
  'use strict';
  var common = angular.module('app.common');

  common.directive('validatableSubmit', validatableSubmit);

  validatableSubmit.$inject = ['$parse'];
  function validatableSubmit($parse) {
      return {
        restrict: 'A',
        require: 'form',
        link: function(scope, form, attrs) {
          var submit = $parse(attrs.validatableSubmit);
          var formScope = scope[attrs.name];
          form.submit(function(evt) {
            formScope.submitted = true;
            !scope.$$phase && scope.$apply();
            if (!formScope.$valid) {
              return false;
            }
            scope.$apply(function() {
              submit(scope, {$event: evt});
            });
          });
        }
      };
  };

})();
