(function() {
  'use strict';

  angular.module('app.common')
    .config(notificatorConfig)
    .factory('notificator', notificator);

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

  notificatorConfig.$inject = ['toastrConfig'];
  function notificatorConfig(toastrConfig) {
    angular.extend(toastrConfig, {
      timeOut: 800
    });
  }

})();
