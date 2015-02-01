(function() {
  var app = angular.module('angular-dashboard-demo-services', []);

//  app.service('Session', function () {
//    this.create = function (sessionId, userId) {
//      this.id = sessionId;
//      this.userId = userId;
//    };
//    this.destroy = function () {
//      this.id = null;
//      this.userId = null;
//    };
//    return this;
//  })

  app.factory('Post', function($resource) {
    return $resource('/posts/:id');
  });

})()