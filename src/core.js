window.AudioContext = window.AudioContext || window.webkitAudioContext;

Wave.context = new (window.AudioContext || window.webkitAudioContext)();

function Wave (selector, context) {
  return new Wave.fn.init(selector, context);
}

Wave.fn = Wave.prototype = {
  constructor: Wave,
  length: 0,

  context: Wave.context,

  start: function (time) {
    this.get(0).start(time);

    return this;
  },

  connect: function (selector, context) {
    var lastNode = this.last();
    var node;
    if (lastNode) {
      node = this.constructor(selector, context || {});

      lastNode.get(0).connect(node.get(0));
      this.push(node.get(0));
    }

    return this;
  },

  disconnect: function (node) {
    var args = [].slice.call(arguments, 1);
    var index = this.indexOf(node);

    if (index !== -1) {
      node.disconnect.apply(node, args);
      this.splice(index, 1);
    }

    return this;
  },

  destination: function () {
    var lastNode = this.last();
    if (lastNode) {
      lastNode.get(0).connect(this.context.destination);
    } else {
      console.error('No AudioNode connect to output.');
    }

    return this;
  },

  attr: function (node, attrs) {
    for (let param in attrs) {
      let value = attrs[param];
      if (node[param] instanceof AudioParam) {
        node[param].value = value;
      } else {
        node[param] = value;
      }
    }
  },

  last: function () {
    return this.eq(-1);
  },

  get: function (num) {
    if (num == null) {
      return slice.call( this );
    }

    return num < 0 ? this[num + this.length] : this[num];
  },

  eq: function (i) {
    var len = this.length,
      j = +i + ( i < 0 ? len : 0 );
    return this.pushStack( j >= 0 && j < len ? [this[j]] : [] );
  },

  pushStack: function (elems) {
    var ret = Wave.merge(this.constructor(), elems);
    ret.prevObject = this;

    return ret;
  },

  each: function (callback) {
    return Wave.each(this, callback);
  },

  map: function (callback) {
    return this.pushStack(Wave.map(this, function(elem, i) {
      return callback.call(elem, i, elem);
    }));
  },

  push: function () {
    [].slice.call(arguments).forEach((arg) => {
      this[this.length] = arg;
      this.length++;
    })

    return this;
  },
  splice: function () {
    return Array.prototype.splice;
  },
  indexOf: function () {
    return Array.prototype.indexOf;
  }
}

Wave.extend = Wave.fn.extend = function () {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // Skip the boolean and the target
    target = arguments[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && !Wave.isFunction(target)) {
    target = {};
  }

  // Extend Wave itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {

    // Only deal with non-null/undefined values
    if ( ( options = arguments[ i ] ) != null ) {

      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( Wave.isPlainObject( copy ) ||
          ( copyIsArray = Array.isArray( copy ) ) ) ) {

          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && Array.isArray( src ) ? src : [];

          } else {
            clone = src && Wave.isPlainObject( src ) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = Wave.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

Wave.extend({
  merge: function(first, second) {
    var len = +second.length,
      j = 0,
      i = first.length;

    for (; j < len; j++) {
      first[i++] = second[j];
    }

    first.length = i;

    return first;
  },
  makeArray: function (arr, results) {
    var ret = results || [];

    if (arr != null) {
      if (isArrayLike(Object(arr))) {
        jQuery.merge(ret,
          typeof arr === "string" ?
          [arr] : arr
        );
      } else {
        push.call(ret, arr);
      }
    }

    return ret;
  }
});

var rquickExpr = /^(?:\s*([\w\W]+)#([\w-]+))$/;

var nodeMap = {
  // audioNode: 'AudioNode',
  // audioParam: 'AudioParam',
  // audioProcessingEvent: 'AudioProcessingEvent',
  // offlineAudioCompletionEvent: 'OfflineAudioCompletionEvent',
  analyser: 'AnalyserNode',
  audioBuffer: 'AudioBuffer',
  audioBufferSource: 'AudioBufferSourceNode',
  audioContext: 'AudioContext',
  audioDestination: 'AudioDestinationNode',
  audioListener: 'AudioListener',
  biquadFilter: 'BiquadFilterNode',
  channelMerger: 'ChannelMergerNode',
  channelSplitter: 'ChannelSplitterNode',
  constantSource: 'ConstantSourceNode',
  convolver: 'ConvolverNode',
  delay: 'DelayNode',
  dynamicsCompressor: 'DynamicsCompressorNode',
  gain: 'GainNode',
  IIRFilter: 'IIRFilterNode',
  mediaElementAudioSource: 'MediaElementAudioSourceNode',
  mediaStreamAudioDestination: 'MediaStreamAudioDestinationNode',
  mediaStreamAudioSource: 'MediaStreamAudioSourceNode',
  offlineAudioContext: 'OfflineAudioContext',
  oscillator: 'OscillatorNode',
  panner: 'PannerNode',
  periodicWave: 'PeriodicWave',
  stereoPanner: 'StereoPannerNode',
  waveShaper: 'WaveShaperNode',

  compressor: 'DynamicsCompressorNode',
  filter: 'BiquadFilterNode',
  iir: 'IIRFilterNode',
  merger: 'ChannelMergerNode',
  shaper: 'WaveShaperNode',
  splitter: 'ChannelSplitterNode',
};

var ANM = {
  nodeTable: {},
  set: function (id, node) {
    this.nodeTable[id] = node;
  },
  find: function (id) {
    return this.nodeTable[id] || null;
  }
};

var init = Wave.fn.init = function(selector, context) {
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
      var node = ANM.find(match[2]);

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

  return Wave.makeArray(selector, this);
}

init.prototype = Wave.fn;

window.Wave = Wave;

// exports = module.exports = Wave;