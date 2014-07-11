'use strict';

function bootstrapGuestModules(clientId) {
  var source = AdfPage.PAGE.findComponentByAbsoluteId(clientId);
  var element = document.getElementById(clientId);
  
  source.OTNBridge = OTNBridge.createBridge(element, function sendMessageToHost(msg) {
    AdfCustomEvent.queue(source, 'guestMsg', msg);
  });

  OTNBootstrapper.bootstrap(element);
}

function sendMessageToGuest(clientId, guestId, message) {
  var source = AdfPage.PAGE.findComponentByAbsoluteId(clientId);
  source.OTNBridge.toGuest(guestId, message);
}
