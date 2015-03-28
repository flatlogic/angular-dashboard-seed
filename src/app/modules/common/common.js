(function() {
  'use strict';

  angular.module('app.common')
    .service('shortHistory', shortHistory)
    .service('session', session)
    .service('authorize', authorize)
    .service('authenticationService', authenticationService);

  shortHistory.$inject = ['$state'];
  function shortHistory($state) {
    var history = this;

    function setItem(what, state, params) {
      history[what] = {
        state: state,
        params: params
      };
    }

    this.init = function(scope) {
      scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        setItem('from', fromState, fromParams);
        setItem('to', toState, toParams);
      });
    };

    this.goTo = function(where) {
      $state.go(history[where].state.name, history[where].params)
    };
  }

  session.$inject = ['$http', '$q', '$rootScope'];
  function session($http, $q, $rootScope) {
    var session = this;

    this.fetchCurrentUser = function(url) {
      var userFetch;
      if (session.getCurrentUser()) {
        userFetch = $q(function(resolve) {
          resolve(session.getCurrentUser());
        });
      } else {
        userFetch = $http.get(url);
      }
      return userFetch;
    };

    this.getCurrentUser = function() {
      return this.user;
    };

    this.setCurrentUser = function(user) {
      this.user = user;
      $rootScope.$broadcast('$userSet', this.user);
    };
  }

  authorize.$inject = ['session', '$state', '$urlRouter', '$rootScope'];
  function authorize(session, $state, $rootScope) {
    this.checkAccess = function(event, toState, toParams) {
      if (!session.getCurrentUser() && !(toState.data && toState.data.noAuth)) {
        event.preventDefault();
        session.fetchCurrentUser('/api/profile')
          .success(function(user) {
            session.setCurrentUser(user);
            $state.go(toState.name, toParams);
          })
          .error(function() {
            $state.go('login');
          });
        }
    };
  }

  authenticationService.$inject = ['$http', '$rootScope', 'session'];
  function authenticationService($http, $rootScope, session) {

    this.login = function(user) {
      return $http.post('/api/login', user)
        .success(function(data) {
          session.setCurrentUser(data);
          $rootScope.$broadcast('$userLoggedIn');
        });
    };

    this.logout = function() {
      return $http.get('/api/logout')
        .success(function(data) {
          session.setCurrentUser(null);
          $rootScope.$broadcast('$userLoggedOut');
        });
    }
  }

})();
