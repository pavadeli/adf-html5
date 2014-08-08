'use strict';

/*
 * OTNBridge is the glue between a host technology and one or more guest technologies on one page. Both the host and all guests should register
 * themselves with the OTNBridge.createBridge(element, callback) and OTNBridge.registerGuest(element, id, callback) methods. It will automatically buffer all messages
 * that were sent before registration of guests. These messages will be sent immediately after registration.
 *
 * It is possible to use multiple nested OTNBridges on one page. It uses the event propagation mechanism of the browser to automatically select the right OTNBridge
 * for a certain DOM subtree.
 * 
 * The reason we need multiple bridges is that some host technologies (read: ADF) have the ability to divide the application in reusable pieces (read: taskflows). We need to be able
 * to determine which part of the screen sent which message.
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

  /*
   * Initialise a new bridge. This bridge will handle all guest registrations and messages from guests in the subtree starting with [element].
   * It returns a handle to the bridge to enable the host to send messages to the guests. All messages from guests to host will be handed to [hostCallback].
   */
  function initBridge(element, hostCallback) {
    
    if (element.otnBridge) return element.otnBridge; // hostCallback is not replaced here. Could that be a problem?

    var guestCallbacks = {},  // Mapping from guestId to guest callback function.
        guestBuffer = {};     // Mapping from guestId to an array of messages waiting to be delivered.

    // Somewhere in this subtree a guest wants to register itself... events are created by the OTNBridge.registerGuest method (below).
    element.addEventListener('otnRegisterGuest', function otnRegisterGuest(evt) {
      evt.stopPropagation();

      guestCallbacks[evt.detail.id] = evt.detail.callback;

      sendMessages();
    });

    // Somewhere in the subtree below element a guest wants to send a message to host. (event created by OTNBridge.toHost method)
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
    return element.otnBridge = {
      toGuest: function toGuest(id, message) {
        (guestBuffer[id] = guestBuffer[id] || []).push(message);
        sendMessages();
      }
    };
  }

  window.OTNBridge = {
    // Returns a bridge that can be used to send messages to guests.
    createBridge: initBridge,

    // Can be used by guests to send a message to the host.
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

