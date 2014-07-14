'use strict';

(function AngularGuestInit(OTNBridge, OTNBootstrapper) {

  angular.module('angularGuest', [])
    .directive('guestComponent', function () {
      return {
        restrict: 'C',
        link: function link(scope, element, attrs) {
          var id = attrs.guestComponent.split(' ')[1];

          scope.toHost = function toHost(msg) {
            OTNBridge.toHost(element[0], id, msg);
          };

          OTNBridge.registerGuest(element[0], id, function (msg) {
            scope.$apply(function () {
              angular.extend(scope, msg);
            });
          });
        }
      }
    });

  OTNBootstrapper.registerBootstrapper('tagcloud', function (node) {
    if (!node.classList.contains('guest-component:')) return;

    angular.element(node).html('<tag-cloud tags="tags" tag-clicked="toHost({clicked:tag.id})"></tag-cloud>');
    angular.bootstrap(node, ['angularGuest', 'tagcloud']);
  });

}(OTNBridge, OTNBootstrapper));