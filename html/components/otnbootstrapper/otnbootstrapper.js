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

    var elements = document.querySelectorAll(selector);
    for (var i = 0, n = elements.length; i < n; i++) {
      bootstrapNode(elements[i], arguments);
    }
  }

  function bootstrapNode(element, args) {
    if (element.guestBootstrapped) return;

    var classes = element.classList;

    for (var i = 0, n = classes.length; i < n; i++) {
      var bootstrapper = components[classes[i]];
      if (bootstrapper) {
        var copy = Array.prototype.slice.call(args);
        copy.unshift(element);
        bootstrapper.apply(this, copy);
        element.guestBootstrapped = true;
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