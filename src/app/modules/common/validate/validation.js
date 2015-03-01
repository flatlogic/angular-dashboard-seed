(function() {
  'use strict';
  var common = angular.module('app.common');

  common.directive('validatableSubmit', validatableSubmit)
        .directive('showClientErrors', showClientErrors)
        .directive('showResponseError', showResponseError)
        .factory('validityCheckListener', validityCheckListener);

  validatableSubmit.$inject = ['$parse'];
  function validatableSubmit($parse) {
      return {
        restrict: 'A',
        require: 'form',
        link: function(scope, $form, attrs, formCtrl) {
          var submit = $parse(attrs.validatableSubmit);

          //hacky fix for making submit btn after input blurs
          $form.find('[type="submit"]').mousedown(function(e){
            e.preventDefault();
          });

          $form.submit(function(evt) {
            if (formCtrl.$invalid) {
              formCtrl.responseError = '';
              scope.$broadcast('show-errors-check-validity');
              return;
            }
            scope.$apply(function() {
              submit(scope).error(function(err) {
                formCtrl.responseErrorMsg = err.message;
                scope.$broadcast('show-errors-check-validity');
              });
            });
          });
        }
      };
  };

  showClientErrors.$inject = ['validityCheckListener'];
  function showClientErrors(validityCheckListener) {
    return {
      restrict: 'A',
      require: '^form',
      scope: {},
      link: function(scope, $el, attrs, formCtrl) {
        var $input = $el.find('[name]');
        var inputName = $input.attr('name');
        var $errorContainer = $el.find('.error-container');
        scope.isInvalid = function() {
          return !!formCtrl[inputName].$invalid;
        };

        $input.bind('blur', function() {
          $errorContainer.toggleClass('has-error', scope.isInvalid());
        });

        validityCheckListener.listenValidityCheck(scope, $errorContainer);

//        scope.$on('show-errors-reset', function() {
//          $timeout(function() {
//            $errorContainer.removeClass('has-error');
//          }, 0, false);
//        });
      }
    }
  }

  showResponseError.$inject = ['validityCheckListener'];
  function showResponseError(validityCheckListener) {
    return {
      restrict: 'A',
      require: '^form',
      scope: {},
      link: function(scope, $el, attrs, formCtrl) {
        var $errorContainer = $el.hasClass('error-container') ? $el : $el.find('.error-container');
        scope.isInvalid = function() {
          return !!formCtrl.responseErrorMsg;
        };

        validityCheckListener.listenValidityCheck(scope, $errorContainer);
      }
    }
  }

  function validityCheckListener() {
    function listenValidityCheck(scope, $container) {
      scope.$on('show-errors-check-validity', function() {
        $container.toggleClass('has-error', scope.isInvalid());
      });
    }
    return {
      listenValidityCheck: listenValidityCheck
    };
  }

})();
