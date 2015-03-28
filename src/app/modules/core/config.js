(function() {
  'use strict';

  var core = angular.module('app.core');

  var config = {
    name: 'Angular dashboard seed',
    appTitle: 'ADD',
    version: '0.1.1'
  };

  core.value('config', config);
})();
