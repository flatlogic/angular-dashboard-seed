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

  session.$inject = ['$http'];
  function session($http) {
    var session = this;

    this.fetchCurrentUser = function(url) {
      session.pending = true;
      return $http.get(url)
        .success(function(user) {
          session.setCurrentUser(user);
          session.pending = false;
        });
    };

    this.getCurrentUser = function() {
      return this.user;
    };

    this.setCurrentUser = function(user) {
      this.user = user;
    };
  }

  auth.$inject = ['session', '$state', '$urlRouter'];
  function auth(session, $state, $urlRouter) {
    this.stateName = 'login';

    this.init = function(stateName) {
      this.stateName = stateName;
    };

    this.checkAccess = function(event, toState) {
      if (!session.getCurrentUser() && !(toState.data && toState.data.noAuth)) {
        event.preventDefault();
        $state.go(this.stateName);
      }
    };
  }

})();
