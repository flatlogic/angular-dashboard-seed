(function() {
  'use strict';

  angular.module('app.core')
    .directive('navCollapseToggler', navCollapseToggler);

  function navCollapseToggler() {

    function toggleNav(show) {
      $('body').toggleClass('nav-shown', show);
    }

    var toggleListeners = {
      'click': function($el){
        $el.on('click', function(evt) {
          toggleNav();
          evt.preventDefault();
        });
      },

      'swipe': function($el) {
        $el.swipe({
          swipeLeft: function() {
             toggleNav(false);
          },
          swipeRight: function() {
              toggleNav(true);
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
