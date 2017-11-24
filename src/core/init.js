define([
  "../core",
  "./var/node-map",
  "./audio-node-module"
], function(wave, nodeMap, ANM) {

  var rquickExpr = /^(?:\s*([\w\W]+)#([\w-]+))$/;

  var init = wave.fn.init = function(selector, context) {
    if (!selector) { return this; }

    var match;

    if (typeof selector === 'string') {
      if (selector[0] === '#') {
        // get existing node
        match = [null, null, selector.slice(1)];
      } else {
        // create node with id
        match = rquickExpr.exec(selector);
      }
    }

    if (match && (match[1] || !context)) {

      // wave( 'node#id' )
      if (match[1]) {
        var nodeName = nodeMap[match[1]];

        if (nodeName) {
          var node = new window[nodeName](this.context, context || {});

          // assign the node to ANM with id
          ANM.set(match[2], node);

          this[0] = node;
          this.length = 1;

          return this;
        }
      } else {
        // wave( '#id' )
        var node = ANM.get(match[2]);

        this[0] = node;
        this.length = 1;

        return this;
      }
    } else if (selector instanceof AudioNode) {
      // wave( AudioNode )
        this[0] = selector;
        this.length = 1;
        return this;
    }

    return wave.makeArray(selector, this);
  }

  init.prototype = wave.fn;

  return init;
});
