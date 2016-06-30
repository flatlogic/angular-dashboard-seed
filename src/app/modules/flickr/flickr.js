(function() {
  'use strict';

  angular.module('app.flickr')
    .controller('flickrController', flickrController);

  flickrController.$inject = ['$scope', '$http'];
  function flickrController($scope, $http) {
    $scope.items = []

    // Store from callback in $scope only data that matters for this example
    window.jsonFlickrFeed = function(data) {
        $scope.title = data.title;
        $scope.link = data.link;
        $scope.items = data.items
    };

    $http.jsonp('https://api.flickr.com/services/feeds/photos_public.gne?format=json&callback=JSON_CALLBACK')
      .then(function(data, status) {
        // console.log('We have some data, yay');
      });
    }

})();
