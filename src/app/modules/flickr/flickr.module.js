(function() {
  'use strict';

  var module = angular.module('app.flickr', ['ui.router']);

  module.config(appConfig);

  appConfig.$inject = ['$stateProvider'];

  function appConfig($stateProvider) {
    $stateProvider
      .state('app.flickr', {
        url: '/flickr',
        templateUrl: 'app/modules/flickr/flickr.html',
        controller: 'flickrController',
        controllerAs: 'vm'
      });
  }
})();
