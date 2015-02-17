(function() {
  'use strict';

  var app = angular.module('app.core');

  app.directive('navAction', navActions);

  function navActions() {
    var navActions = {
      'toggle-navigation-collapse-state': function(e, scope){
        $('body').toggleClass('nav-shown');
      }
    };
    return {
      restrict: 'A',
      link: function(scope, $el, attrs){
        if (angular.isDefined(attrs.navAction) && attrs.navAction != '') {
          $el.on('click', function(e) {
            scope.$apply(function(){
              navActions[attrs.navAction].call($el[0], e, scope);
            });
            e.preventDefault();
          });
        }

        if (angular.isDefined(attrs.tooltip) && attrs.navAction != ''){
          $el.tooltip();
        }
      }
    }
  }

//  function navDropdown() {
//    return {
//      restrict: 'EA',
//      link: function(scope, $el, attrs) {
//        console.log(attrs);
//        scope.getTemplate = function() {
//          return attrs.dropdownTemplate;
//        };
//
//        scope.linkTitle = attrs.linkTitle || attrs.linkTitleTemplate;
//
//        $el.on('click', function(){
//          $el.find('.nav-dropdown-item').toggleClass('hidden');
//        });
//      },
//      templateUrl: 'app/modules/core/partials/dropDownLink.html'
//    };
//  }

})();
