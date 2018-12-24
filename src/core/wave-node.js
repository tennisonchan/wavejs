define([
  "../core"
], function (wave) {

  function WaveNode(id, node) {
    this.id = id;
    this.node = node;
    this.inputs = [];
    this.outputs = [];
  }

  function connect (inNode, outNode) {
    var args = [].slice.call(arguments, 2);
    if (inNode.node && outNode.node &&
        wave.isFunction(inNode.node.connect) &&
        outNode.node instanceof AudioNode) {
      inNode.node.connect.apply(inNode.node, [outNode.node].concat(args));

      inNode.outputs.push(outNode);
      outNode.inputs.push(inNode);
    }

    return outNode;
  }

  WaveNode.prototype = {
    constructor: WaveNode,
    context: wave.context,
    set: function (params) {
      var node = this.node;

      for (let param in params) {
        let value = params[param];
        if (node[param] instanceof AudioParam) {
          node[param].value = value;
        } else {
          node[param] = value;
        }
      }
    },
    connect: function (selector, context) {
      if (wave.type(selector) === "string") {
        selector = new wave(selector, context);
      }

      return this;
    },
    disconnect: function () {
      // this.inputs.each
      // this.outputs

      return this;
    },
    destination: function () {
      var node = new wave.fn.init(this.context.destination);
      connect(this, node);

      return this;
    },
    start: function () {
      var node = this.node;

      if(wave.isFunction(node.start)) {
        node.start.apply(node, arguments);
      }

      return this;
    }
  };

  return WaveNode;
});
