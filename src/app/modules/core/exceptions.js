(function() {
  'use strict';

  var core = angular.module('app.core');

//  core.factory('responseErrorInterceptor', responseErrorInterceptor);
//  core.config(['$httpProvider', function($httpProvider) {
//    $httpProvider.interceptors.push('responseErrorInterceptor');
//  }]);

  core.config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', exceptionHandlerDecorator);
  }]);

  exceptionHandlerDecorator.$inject = ['$delegate', '$injector'];
  function exceptionHandlerDecorator($delegate, $injector) {
    return function(exception, cause) {
      var toastr = $injector.get('toastr');
      toastr.error(exception.message, 'Error');
      $delegate(exception, cause);
    };
  }

  responseErrorInterceptor.$inject = ['$q']
  function responseErrorInterceptor($q) {
    return {
     responseError: function(res) {
       if (res.status == 401) {
         throw new UnauthorizedError();
       } else {
         throw new Error(res.data.message || 'Unknown error');
       }
     }
    }
  }

  function UnauthorizedError(message) {
    this.name = 'UnauthorizedError';
    this.message = message || 'Please, login first.';
    this.stack = (new Error()).stack;
  }
  UnauthorizedError.prototype = Object.create(Error.prototype);
  UnauthorizedError.prototype.constructor = UnauthorizedError;

})();
