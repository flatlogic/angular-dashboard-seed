(function() {
    'use strict';

    var core = angular.module('app.core')
//                    .factory('jQuery', jQueryFactory)
//                    .factory('_', underscoreFactory);

    var config = {
        name: 'Angular dashboard demo',
        appTitle: 'Angular dashboard demo',
        version: '0.0.1'
    };
    core.value('config', config);

//    jQueryFactory.$inject = ['$window'];
//    function jQueryFactory($window) {
//        return $window.jQuery;
//    }
//
//    underscoreFactory.$inject = ['$window'];
//    function underscoreFactory($window) {
//        return $window._;
//    }

})();
