(function() {
  'use strict';

    navCollapseToggler.$inject = ['$document'];

  angular.module('app.core')
    .directive('navCollapseToggler', navCollapseToggler);

  function navCollapseToggler($document) {

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

          // fixing unselectable text problem
          // see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin/issues/149
          function isMobile() {
              try {
                  $document[0].createEvent('TouchEvent');
                  return true;
              } catch (e) {
                  return false;
              }
          }

          if (isMobile()) {
              $el.swipe({
                  swipeLeft: function() {
                      toggleNav(false);
                  },
                  swipeRight: function() {
                      toggleNav(true);
                  }
              });
          }
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
