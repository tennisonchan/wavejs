define([
  "./core"
], function(wave) {

  var events = "ended statechange complete ended message loaded audioprocess nodecreate".split(" ");

  wave.fn.extend({
    on: function(type, fn) {

    }
  });

  return wave;
});