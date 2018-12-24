define([
  '../core'
], function(wave) {

  wave.fn.extend({
    toMono: function(input) {
      var splitter = this.context.createChannelSplitter(2);
      var merger = this.context.createChannelMerger(2);

      input.connect(splitter);
      splitter.connect(merger, 0, 0);
      splitter.connect(merger, 0, 1);

      return merger;
    }
  });

  return wave;
});
