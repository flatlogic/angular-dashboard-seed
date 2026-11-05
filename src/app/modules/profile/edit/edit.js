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
        .then(function(response) {
          session.setCurrentUser(response.data);
          notificator.success('Profile changes saved')
        }, function(response) {
          vm.responseErrorMsg = response.data.message;
        });
    };

    vm.cancel = function() {
      vm.responseErrorMsg = '';
      vm.user = $.extend(true, {}, session.getCurrentUser());
    };
  }

})();
