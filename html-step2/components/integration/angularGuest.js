'use strict';

/*
 * Here the tagcloud AngularJS component is registered as a guest technology with the OTNBridge and the OTNBootstrapper. This supports the following syntax to
 * bootstrap components: class="guest-component: componentToBootstrap guestId".
 */
(function AngularGuestInit(OTNBridge, OTNBootstrapper) {

  /*
   * This is the definition of the angularGuest module that is used to bootstrap our components.
   */
  angular.module('angularGuest', [])
    // Because we use the class="guest-component: componentToBootstrap guestId" syntax we can use the builtin support from Angular to process this.
    .directive('guestComponent', function () {
      return {
        restrict: 'C',
        link: function link(scope, element, attrs) {
          // Fetch the id of the component. This is always the second part of the declaration (in our syntax).
          var id = attrs.guestComponent.split(' ')[1];

          // This toHost function can be used by our component to send a message to the host.
          scope.toHost = function toHost(msg) {
            OTNBridge.toHost(element[0], id, msg);
          };

          // We need to register this component with the OTNBridge to receive messages. Messages are supposed to be a map. All key-value pairs in this
          // map are put on the scope to be used by the guest component.
          OTNBridge.registerGuest(element[0], id, function (msg) {
            scope.$apply(function () {
              angular.extend(scope, msg);
            });
          });
        }
      }
    });

  /*
   * Now we register the tagcloud component with the OTNBootstrapper.
   */
  OTNBootstrapper.registerBootstrapper('tagcloud', function (node) {
    if (!node.classList.contains('guest-component:')) return;

    // First we replace the contents of the given [node] with the following HTML.
    angular.element(node).html('<tag-cloud tags="tags" tag-clicked="toHost({clicked:tag.id})"></tag-cloud>');
    
    // We now bootstrap a new Angular application at this [node]. Of course we make sure to load the tagcloud module as a dependency.
    angular.bootstrap(node, ['angularGuest', 'tagcloud']);
  });

}(OTNBridge, OTNBootstrapper));