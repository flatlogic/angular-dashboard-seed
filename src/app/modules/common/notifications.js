(function() {
  'use strict';

  angular.module('app.common')
    .config(notificatorConfig)
    .factory('notificator', notificator)
    .run(notificationsRun);

  notificator.$inject = ['toastr'];
  function notificator(toastr) {
    return {
      success: function(msg, title) {
        toastr.success(msg, title);
      },
      warning: function(msg, title) {
        toastr.warning(msg, title);
      },
      error: function(msg, title) {
        toastr.error(msg, title);
      },
      info: function(msg, title) {
        toastr.info(msg, title);
      }
    }
  }

  notificationsRun.$inject = ['$rootScope', 'notificator'];
  function notificationsRun($rootScope, notificator) {
    $rootScope.$on('$userLoggedIn', function() {
      notificator.success('Logged in successfully')
    });
    $rootScope.$on('$userLoggedOut', function() {
      notificator.success('Logged out successfully');
    });
  }

  notificatorConfig.$inject = ['toastrConfig'];
  function notificatorConfig(toastrConfig) {
    angular.extend(toastrConfig, {
      timeOut: 800
    });
  }

})();
