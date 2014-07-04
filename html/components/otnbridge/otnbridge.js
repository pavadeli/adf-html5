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