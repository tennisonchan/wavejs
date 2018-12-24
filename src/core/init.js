define([
  "../core",
  "./var/node-map",
  "./audio-node-module",
  "./wave-node",
  './wave-collection'
], function(wave, nodeMap, ANM, WaveNode, WaveCollection) {

  var rquickExpr = /^(?:\s*([\w\W]+)#([\w-]+))$/;

  var init = wave.fn.init = function(selector, context) {
    if (!selector) { return this; }

    var match, waveNode;

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
        if (nodeName && window[nodeName]) {
          var id = match[2];
          var node = new window[nodeName](this.context, context || {});
          waveNode = new WaveNode(id, node, this.context);

          // assign the node to ANM with id
          ANM.set(id, waveNode);
        }
      } else {
        // wave( '#id' )
        waveNode = ANM.get(match[2]);
      }
    } else if (selector instanceof AudioNode) {
      // wave( AudioNode )
       waveNode = new WaveNode(id, selector, this.context);
    }

    return wave.makeArray(this, new WaveCollection(waveNode));
  }

  init.prototype = wave.fn;

  return init;
});
