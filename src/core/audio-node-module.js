define([], function() {

  return {
    nodeTable: {},
    set: function (id, node) {
      this.nodeTable[id] = node;
    },
    get: function (id) {
      return this.nodeTable[id] || null;
    }
  };

});
