(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', profileController);

  profileController.$inject = ['$http', 'session', 'notificator'];
  function profileController($http, session, notificator) {
    var vm = this;
    vm.user = $.extend(true, {}, session.getCurrentUser());
    vm.responseErrorMsg = '';

    vm.update = function() {
      $http.put('/api/profile', vm.user)
        .success(function(data) {
          session.setCurrentUser(data);
          notificator.success('Profile changes saved')
        })
        .error(function(err) {
          vm.responseErrorMsg = err.message;
        });
    };

    vm.cancel = function() {
      vm.responseErrorMsg = '';
      vm.user = $.extend(true, {}, session.getCurrentUser());
    };
  }

})();
