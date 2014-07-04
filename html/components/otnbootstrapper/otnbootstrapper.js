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