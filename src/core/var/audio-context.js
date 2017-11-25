define(function() {

  'use strict';

  var _cache = {};
  var AudioContext, OfflineAudioContext;

  if (typeof window !== 'undefined') {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  }

  return function (options) {
    if (!AudioContext) return null;

    options = options || {};
    var sampleRate = options.sampleRate || 44100;
    var context = _cache[sampleRate];

    if (context) return context;

    if (options.offline) {
      if (!OfflineAudioContext) return null;
      return new OfflineAudioContext(options.channels || 2, options.length, sampleRate);
    }

    try {
      context = new AudioContext(options);
    } catch (e) {
      context = new AudioContext();
    }
    _cache[sampleRate] = context;

    return context;
  }

});