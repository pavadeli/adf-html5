'use strict';

function bootstrapGuestModules(evt) {
  evt.cancel();

  var source = evt.getSource();

  OTNBridge.registerHost(function sendMessageToHost(msg) {
    AdfCustomEvent.queue(source, 'guestMsg', msg);
  });

  OTNBootstrapper.bootstrap();
}
