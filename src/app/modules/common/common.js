(function() {
  'use strict';

  angular.module('app.common')
    .service('shortHistory', shortHistory)
    .service('session', session)
    .service('auth', auth);

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

  session.$inject = ['$http', '$q'];
  function session($http, $q) {
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
    };
  }

  auth.$inject = ['session', '$state', '$urlRouter', '$rootScope'];
  function auth(session, $state, $rootScope) {
    var auth = this;

    this.init = function(stateName, profileApi) {
      this.stateName = stateName || 'login';
      this.profileApi = profileApi || '/api/profile';
    };

    this.checkAccess = function(event, toState, toParams) {
      if (!session.getCurrentUser() && !(toState.data && toState.data.noAuth)) {
        event.preventDefault();
        session.fetchCurrentUser(auth.profileApi)
          .success(function(user) {
            session.setCurrentUser(user);
            $state.go(toState.name, toParams);
          })
          .error(function() {
            $state.go(auth.stateName);
          });
        }
    };
  }

})();
