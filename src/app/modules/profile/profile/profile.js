(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', profileController);

  profileController.$inject = ['$http', '$scope'];
  function profileController($http, $scope) {
    var vm = this;
    vm.user = $.extend(true, {}, $scope.currentUser);
    vm.responseErrorMsg = '';

    this.update = function() {
      $http.put('/api/profile', this.user)
        .success(function(data) {
          $scope.setCurrentUser(data);
        })
        .error(function(err) {
          vm.responseErrorMsg = err.message;
        });
    };

    this.cancel = function() {
      vm.responseErrorMsg = '';
      this.user = $.extend(true, {}, $scope.currentUser);
    };
  }

})();
