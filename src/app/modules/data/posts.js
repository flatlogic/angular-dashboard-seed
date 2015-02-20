(function() {
  'use strict';

  angular.module('app.data')
    .factory('postResource', postResource);

  postResource.$inject = ['$resource'];

  function postResource($resource) {
    return $resource('/api/posts/:id', {id: '@id'}, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
