(function() {
  'use strict';

  var app = angular.module('app.core');

  app.directive('navCollapseToggler', navCollapseToggler);

  function navCollapseToggler() {
    var toggleListeners = {
      'click': function($el){
        $el.on('click', function(e) {
          $('body').toggleClass('nav-shown');
          e.preventDefault();
        });
      },

      'swipe': function($el) {
        $el.swipe({
          swipeLeft: function() {
            if ($('body').hasClass('nav-shown')) {
              $('body').toggleClass('nav-shown', false);
            }
          },
          swipeRight: function() {
            if (!$('body').hasClass('nav-shown')) {
              $('body').toggleClass('nav-shown', true);
            }
          }
        });
      }
    };

    return {
      restrict: 'A',
      scope: {
        type: '@'
      },
      link: function(scope, $el, attrs){
        toggleListeners[scope.type]($el, scope);
      }
    }
  }
})();
