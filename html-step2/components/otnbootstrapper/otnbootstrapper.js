'use strict';

/*
 * The OTNBootstrapper is responsible for bootstrapping all guest components. These guest components need to register their bootstrap method once with [registerBootstrapper].
 */

(function OTNBootstrapperInit(window) {

  if (window.OTNBootstrapper) return;

  var components = {};

  function bootstrap(element) {
    // Build a selector based on all the ids (we are looking for elements that have className equal to one of the ids).
    var selector;
    for (var id in components) {
      selector = (selector ? selector + ',.' : '.') + id;
    }

    // Now try to bootstrap all "possibly interesting" elements.
    var elements = element.querySelectorAll(selector);
    for (var i = 0, n = elements.length; i < n; i++) {
      bootstrapNode(elements[i], arguments);
    }
  }

  function bootstrapNode(element, args) {
    if (element.guestBootstrapped) return;

    var classes = element.classList;

    for (var i = 0, n = classes.length; i < n; i++) {
      // If we find a bootstrapper for this element, we call it providing it with all the additional arguments that were passed to the bootstrap method. Is
      // not needed anymore, but I like it. ;-)
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
    /*
     * Register a bootstrapper. This [bootstrapper] will be notified of all elements that have the class [id].
     */
    registerBootstrapper: function registerBootstrapper(id, bootstrapper) {
      components[id] = bootstrapper;
    },

    /*
     * Bootstrap all components in the subtree below [element] (first argument to this function).
     */
    bootstrap: bootstrap
  };

}(window));