define([
  "../core"
], function(wave) {

  function WaveCollection (waveNode) {
    this[0] = waveNode;
    this.length = 1;
  }

  WaveCollection.prototype = {
    constructor: WaveCollection,
    length: 0,

    context: wave.context,

    connect: function(selector) {
      var node = this[this.length - 1].connect(selector);
      debugger;

      return this;
    },

    last: function () {
      return this.eq(-1);
    },

    get: function (num) {
      if (num == null) {
        return slice.call(this);
      }

      return num < 0 ? this[num + this.length] : this[num];
    },

    eq: function (i) {
      var len = this.length,
        j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },

    pushStack: function (elems) {
      var ret = wave.merge(this.constructor(), elems);
      ret.prevObject = this;

      return ret;
    },

    each: function (callback) {
      return wave.each(this, callback);
    },

    map: function (callback) {
      return this.pushStack(wave.map(this, function(elem, i) {
        return callback.call(elem, i, elem);
      }));
    },

    push: function () {
      [].slice.call(arguments).forEach((arg) => {
        this[this.length] = arg;
        this.length++;
      });

      return this;
    },

    splice: function () {
      return Array.prototype.splice;
    },
    indexOf: function () {
      return Array.prototype.indexOf;
    }
  }

  return WaveCollection;
});
