(function() {
    'use strict';

    angular.module('app.common')
        .config(notificatorConfig)
        .factory('notificator', notificator)
        .run(notificationsRun);

    notificator.$inject = ['toastr'];
    function notificator(toastr) {
        return {
            success: function(msg, title) {
                toastr.success(msg, title);
            },
            warning: function(msg, title) {
                toastr.warning(msg, title);
            },
            error: function(msg, title) {
                toastr.error(msg, title);
            },
            info: function(msg, title) {
                toastr.info(msg, title);
            }
        }
    }

    notificationsRun.$inject = ['$rootScope', 'notificator', '$timeout'];
    function notificationsRun($rootScope, notificator, $timeout) {
        $rootScope.$on('$userLoggedIn', function() {
            notificator.success('Hey there!');

            $timeout(function(){
                notificator.info('Welcome to this free angular dashboard seed project,' +
                ' that you may use to bootstrap your next web app!', {
                    timeOut: 10000
                });
            },3000);

            $timeout(function(){
                notificator.info('Btw, feel free to contribute to this project and help us kill the paid templates market ;)', {
                    timeOut: 10000
                });
            },15000)
        });
        $rootScope.$on('$userLoggedOut', function() {
            notificator.success('Logged out successfully');
        });
    }

    notificatorConfig.$inject = ['toastrConfig'];
    function notificatorConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            timeOut: 3000
        });
    }

})();
