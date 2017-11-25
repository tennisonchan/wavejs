define([], function() {

  var nodeTable = {}

  return {
    set: function (id, node) {
      nodeTable[id] = node;
    },
    get: function (id) {
      return nodeTable[id] || null;
    }
  };

});
