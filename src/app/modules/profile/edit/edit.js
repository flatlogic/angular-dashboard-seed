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

    this.update = function() {
      $http.put('/api/profile', this.user)
        .success(function(data) {
          session.setCurrentUser(data);
          notificator.success('Profile changes saved')
        })
        .error(function(err) {
          vm.responseErrorMsg = err.message;
        });
    };

    this.cancel = function() {
      vm.responseErrorMsg = '';
      this.user = $.extend(true, {}, session.getCurrentUser());
    };
  }

})();
