'use strict';

/*
 * OTNBridge is the glue between a host technology and one or more guest technologies on one page. Both the host and all guests should register
 * themselves with the OTNBridge.registerHost(callback) and OTNBridge.registerGuest(id, callback) methods. It will automatically buffer all messages
 * that were sent before registration of both host and guests. These messages will be sent immediately after registration.
 */

(function OTNBridgeInit(window) {

  if (window.OTNBridge) return;

  var hostBuffer = [],
      guestBuffer = {},
      hostCallback,
      guestCallbacks = {},
      timeoutID;

  function loop() {
    timeoutID = null;

    for (var id in guestBuffer) {
      var callback = guestCallbacks[id];
      var buffer = guestBuffer[id];
      while (callback && buffer && buffer.length) {
        callback(buffer.shift());
      }
    }
    while (hostCallback && hostBuffer.length) {
      hostCallback(hostBuffer.shift());
    }
  }

  function queueLoop() {
    if (!timeoutID) timeoutID = setTimeout(loop, 0);
  }

  window.OTNBridge = {
    registerHost: function registerHost(cb) {
      hostCallback = cb;
      queueLoop();
    },

    registerGuest: function registerGuest(id, cb) {
      guestCallbacks[id] = cb;
      queueLoop();
    },

    toHost: function toHost(guestId, message) {
      hostBuffer.push({id: guestId, msg: message});
      queueLoop();
    },

    toGuest: function toGuest(id, message) {
      (guestBuffer[id] = guestBuffer[id] || []).push(message);
      queueLoop();
    }
  };

})(window);
'use strict';

/*
 *
 */

(function OTNBootstrapperInit(window, document) {

  if (window.OTNBootstrapper) return;

  var components = {};

  function bootstrap() {
    var selector;
    for (var id in components) {
      selector = (selector ? selector + ',.' : '.') + id;
    }

    var nodes = document.querySelectorAll(selector);
    for (var i = 0, n = nodes.length; i < n; i++) {
      bootstrapNode(nodes[i], arguments);
    }
  }

  function bootstrapNode(node, args) {
    var classes = node.classList;

    for (var i = 0, n = classes.length; i < n; i++) {
      var bootstrapper = components[classes[i]];
      if (bootstrapper) {
        var copy = Array.prototype.slice.call(args);
        copy.unshift(node);
        bootstrapper.apply(this, copy)
      }
    }
  }

  window.OTNBootstrapper = {
    registerBootstrapper: function registerComponent(id, bootstrapper) {
      components[id] = bootstrapper;
    },

    bootstrap: bootstrap
  };

}(window, document));
'use strict';

function bootstrapGuestModules(evt) {
  evt.cancel();

  var source = evt.getSource();

  OTNBridge.registerHost(function sendMessageToHost(msg) {
    AdfCustomEvent.queue(source, 'guestMsg', msg);
  });

  OTNBootstrapper.bootstrap();
}

'use strict';

(function AngularGuestInit(OTNBridge, OTNBootstrapper) {

  angular.module('angularGuest', [])
    .directive('guestComponent', function () {
      return {
        restrict: 'C',
        link: function link(scope, element, attrs) {
          var id = attrs.guestComponent.split(' ')[1];

          scope.toHost = function toHost(msg) {
            OTNBridge.toHost(id, msg);
          };

          OTNBridge.registerGuest(id, function (msg) {
            scope.$apply(function () {
              angular.extend(scope, msg);
            });
          });
        }
      }
    });

  OTNBootstrapper.registerBootstrapper('tagcloud', function (node) {
    angular.element(node).html('<tag-cloud tags="tags" tag-clicked="toHost({clicked:tag.id})"></tag-cloud>');
    angular.bootstrap(node, ['angularGuest', 'tagcloud']);
  });

}(OTNBridge, OTNBootstrapper));