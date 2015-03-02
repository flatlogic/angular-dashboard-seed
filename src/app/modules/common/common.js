(function() {
  'use strict';

  var module = angular.module('app.common')
    .service('shortHistory', shortHistory);

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

})();
