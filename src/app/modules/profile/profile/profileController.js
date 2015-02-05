(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileController', profileController);

  profileController.$inject = ['$http', '$scope'];

  function profileController($http, $scope) {
    this.user = JSON.parse(JSON.stringify($scope.currentUser));

    this.update = function() {
      $http.put('/api/profile', this.user)
        .success(function(data) {
          $scope.setCurrentUser(data);
        })
        .error(function(err) {
          console.log(err);
        });
    };

    this.cancel = function() {
      this.user = JSON.parse(JSON.stringify($scope.currentUser));
    };
  }

})();
