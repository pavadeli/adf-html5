'use strict';

/*
 * OTNBridge is the glue between a host technology and one or more guest technologies on one page. Both the host and all guests should register
 * themselves with the OTNBridge.createBridge(element, callback) and OTNBridge.registerGuest(element, id, callback) methods. It will automatically buffer all messages
 * that were sent before registration of guests. These messages will be sent immediately after registration.
 */

(function OTNBridgeInit(window, document) {

  if (window.OTNBridge) return;

  // If events bubble up to document apparently no bridge was initialised to capture these events.
  document.addEventListener('otnRegisterGuest', function otnRegisterGuest() {
    throw new Error('registerGuest called but no bridge answered!');
  });
  document.addEventListener('otnMessageToHost', function otnMessageToHost() {
    throw new Error('toHost called but no bridge answered!');
  });

  function initBridge(element, hostCallback) {
    if (element.bridgeInstalled) return;
    element.bridgeInstalled = true;

    var guestCallbacks = {},
        guestBuffer = {};

    // Somewhere in this subtree a guest wants to register itself... this appears to be the closest bridge.
    element.addEventListener('otnRegisterGuest', function otnRegisterGuest(evt) {
      evt.stopPropagation();

      guestCallbacks[evt.detail.id] = evt.detail.callback;

      sendMessages();
    });

    // Somewhere in the subtree below element a guest wants to send a message to host.
    element.addEventListener('otnMessageToHost', function otnMessageToHost(evt) {
      evt.stopPropagation();

      hostCallback(evt.detail.message);
    });

    function sendMessages() {
      for (var id in guestBuffer) {
        var callback = guestCallbacks[id];
        var buffer = guestBuffer[id];
        while (callback && buffer && buffer.length) {
          callback(buffer.shift());
        }
      }
    }

    // The bridge (returned from this function) has a method to send messages to guests.
    var bridge = {
      toGuest: function toGuest(id, message) {
        (guestBuffer[id] = guestBuffer[id] || []).push(message);
        sendMessages();
      }
    };

    return bridge;
  }

  window.OTNBridge = {
    // Returns a bridge that can be used to send messages to guests.
    createBridge: function createBridge(element, hostCallback) {
      return initBridge(element, hostCallback);
    },

    // Can be used by guests to send a message to the appropriate host.
    toHost: function toHost(element, guestId, message) {
      element.dispatchEvent(new CustomEvent('otnMessageToHost', {
        bubbles: true,
        detail: {
          message: {
            id: guestId,
            msg: message
          }
        }
      }));
    },

    // Can be used by guests to register themselves at the appropriate bridge.
    registerGuest: function registerGuest(element, guestId, callback) {
      element.dispatchEvent(new CustomEvent('otnRegisterGuest', {
        bubbles: true,
        detail: {
          id: guestId,
          callback: callback
        }
      }));
    }
  }

})(window, document);



// Polyfill for CustomEvent for IE 10 and 11
(function () {
  if (window.CustomEvent) return;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   };

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

