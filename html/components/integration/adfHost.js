'use strict';

function bootstrapGuestModules(clientId) {
  var element = document.getElementById(clientId);
  
  element.OTNBridge = OTNBridge.createBridge(element, function sendMessageToHost(msg) {
    var source = AdfPage.PAGE.findComponentByAbsoluteId(clientId);
    AdfCustomEvent.queue(source, 'guestMsg', msg);
  });

  OTNBootstrapper.bootstrap(element);
}

function sendMessageToGuest(clientId, guestId, message) {
  var element = document.getElementById(clientId);
  element.OTNBridge.toGuest(guestId, message);
}
