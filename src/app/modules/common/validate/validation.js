(function() {
  'use strict';
  var common = angular.module('app.common');

  common.directive('validatableSubmit', validatableSubmit)
        .directive('showErrors', showErrors);

  validatableSubmit.$inject = ['$parse'];
  function validatableSubmit($parse) {
      return {
        restrict: 'A',
        require: 'form',
        link: function(scope, $form, attrs, formCtrl) {
          var submit = $parse(attrs.validatableSubmit);
          $form.submit(function(evt) {
            scope.$broadcast('show-errors-check-validity');
            formCtrl.$valid && scope.$apply(function() {
              submit(scope, {$event: evt});
            });
          });
        }
      };
  };

  function showErrors() {
    return {
      restrict: 'A',
      require: '^form',
      link: function(scope, $el, attrs, formCtrl) {
        var $input = $el.find('[name]');
        var inputName = $input.attr('name');
        $input.bind('blur', function() {
          console.log(formCtrl[inputName]);
          $el.toggleClass('has-error', formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-check-validity', function() {
          $el.toggleClass('has-error', formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-reset', function() {
          $timeout(function() {
            $el.removeClass('has-error');
          }, 0, false);
        });
      }
    }
  }

})();
