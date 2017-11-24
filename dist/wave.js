(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.AudioContext = window.AudioContext || window.webkitAudioContext;

Wave.context = new (window.AudioContext || window.webkitAudioContext)();

function Wave(selector, context) {
  return new Wave.fn.init(selector, context);
}

Wave.fn = Wave.prototype = {
  constructor: Wave,
  length: 0,

  context: Wave.context,

  start: function start(time) {
    this.get(0).start(time);

    return this;
  },

  connect: function connect(selector, context) {
    var lastNode = this.last();
    var node;
    if (lastNode) {
      node = this.constructor(selector, context || {});

      lastNode.get(0).connect(node.get(0));
      this.push(node.get(0));
    }

    return this;
  },

  disconnect: function disconnect(node) {
    var args = [].slice.call(arguments, 1);
    var index = this.indexOf(node);

    if (index !== -1) {
      node.disconnect.apply(node, args);
      this.splice(index, 1);
    }

    return this;
  },

  destination: function destination() {
    var lastNode = this.last();
    if (lastNode) {
      lastNode.get(0).connect(this.context.destination);
    } else {
      console.error('No AudioNode connect to output.');
    }

    return this;
  },

  attr: function attr(node, attrs) {
    for (var param in attrs) {
      var value = attrs[param];
      if (node[param] instanceof AudioParam) {
        node[param].value = value;
      } else {
        node[param] = value;
      }
    }
  },

  last: function last() {
    return this.eq(-1);
  },

  get: function get(num) {
    if (num == null) {
      return slice.call(this);
    }

    return num < 0 ? this[num + this.length] : this[num];
  },

  eq: function eq(i) {
    var len = this.length,
        j = +i + (i < 0 ? len : 0);
    return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
  },

  pushStack: function pushStack(elems) {
    var ret = Wave.merge(this.constructor(), elems);
    ret.prevObject = this;

    return ret;
  },

  each: function each(callback) {
    return Wave.each(this, callback);
  },

  map: function map(callback) {
    return this.pushStack(Wave.map(this, function (elem, i) {
      return callback.call(elem, i, elem);
    }));
  },

  push: function push() {
    var _this = this;

    [].slice.call(arguments).forEach(function (arg) {
      _this[_this.length] = arg;
      _this.length++;
    });

    return this;
  },
  splice: function splice() {
    return Array.prototype.splice;
  },
  indexOf: function indexOf() {
    return Array.prototype.indexOf;
  }
};

Wave.extend = Wave.fn.extend = function () {
  var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
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
  if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !Wave.isFunction(target)) {
    target = {};
  }

  // Extend Wave itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {

    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {

      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (Wave.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && Wave.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = Wave.extend(deep, clone, copy);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

Wave.extend({
  merge: function merge(first, second) {
    var len = +second.length,
        j = 0,
        i = first.length;

    for (; j < len; j++) {
      first[i++] = second[j];
    }

    first.length = i;

    return first;
  },
  makeArray: function makeArray(arr, results) {
    var ret = results || [];

    if (arr != null) {
      if (isArrayLike(Object(arr))) {
        jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
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
  splitter: 'ChannelSplitterNode'
};

var ANM = {
  nodeTable: {},
  set: function set(id, node) {
    this.nodeTable[id] = node;
  },
  find: function find(id) {
    return this.nodeTable[id] || null;
  }
};

var init = Wave.fn.init = function (selector, context) {
  if (!selector) {
    return this;
  }

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
};

init.prototype = Wave.fn;

window.Wave = Wave;

// exports = module.exports = Wave;

},{}],2:[function(require,module,exports){
"use strict";

Wave.extend({
  convertToMono: function convertToMono(input) {
    var splitter = this.context.createChannelSplitter(2);
    var merger = this.context.createChannelMerger(2);

    input.connect(splitter);
    splitter.connect(merger, 0, 0);
    splitter.connect(merger, 0, 1);

    return merger;
  }
});

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jb3JlLmpzIiwic3JjL21vbm8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsT0FBTyxZQUFQLEdBQXNCLE9BQU8sWUFBUCxJQUF1QixPQUFPLGtCQUFwRDs7QUFFQSxLQUFLLE9BQUwsR0FBZSxLQUFLLE9BQU8sWUFBUCxJQUF1QixPQUFPLGtCQUFuQyxHQUFmOztBQUVBLFNBQVMsSUFBVCxDQUFlLFFBQWYsRUFBeUIsT0FBekIsRUFBa0M7QUFDaEMsU0FBTyxJQUFJLEtBQUssRUFBTCxDQUFRLElBQVosQ0FBaUIsUUFBakIsRUFBMkIsT0FBM0IsQ0FBUDtBQUNEOztBQUVELEtBQUssRUFBTCxHQUFVLEtBQUssU0FBTCxHQUFpQjtBQUN6QixlQUFhLElBRFk7QUFFekIsVUFBUSxDQUZpQjs7QUFJekIsV0FBUyxLQUFLLE9BSlc7O0FBTXpCLFNBQU8sZUFBVSxJQUFWLEVBQWdCO0FBQ3JCLFNBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxLQUFaLENBQWtCLElBQWxCOztBQUVBLFdBQU8sSUFBUDtBQUNELEdBVndCOztBQVl6QixXQUFTLGlCQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkI7QUFDcEMsUUFBSSxXQUFXLEtBQUssSUFBTCxFQUFmO0FBQ0EsUUFBSSxJQUFKO0FBQ0EsUUFBSSxRQUFKLEVBQWM7QUFDWixhQUFPLEtBQUssV0FBTCxDQUFpQixRQUFqQixFQUEyQixXQUFXLEVBQXRDLENBQVA7O0FBRUEsZUFBUyxHQUFULENBQWEsQ0FBYixFQUFnQixPQUFoQixDQUF3QixLQUFLLEdBQUwsQ0FBUyxDQUFULENBQXhCO0FBQ0EsV0FBSyxJQUFMLENBQVUsS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFWO0FBQ0Q7O0FBRUQsV0FBTyxJQUFQO0FBQ0QsR0F2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TCxJQUFVLElBQVY7QUFDQSxXQUFLLE1BQUwsR0FBYyxDQUFkOztBQUVBLGFBQU8sSUFBUDtBQUNEO0FBQ0YsR0ExQkQsTUEwQk8sSUFBSSxvQkFBb0IsU0FBeEIsRUFBbUM7QUFDeEM7QUFDRSxTQUFLLENBQUwsSUFBVSxRQUFWO0FBQ0EsU0FBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFdBQU8sSUFBUDtBQUNIOztBQUVELFNBQU8sS0FBSyxTQUFMLENBQWUsUUFBZixFQUF5QixJQUF6QixDQUFQO0FBQ0QsQ0FqREQ7O0FBbURBLEtBQUssU0FBTCxHQUFpQixLQUFLLEVBQXRCOztBQUVBLE9BQU8sSUFBUCxHQUFjLElBQWQ7O0FBRUE7Ozs7O0FDcFVBLEtBQUssTUFBTCxDQUFZO0FBQ1YsaUJBQWUsdUJBQVMsS0FBVCxFQUFnQjtBQUM3QixRQUFJLFdBQVcsS0FBSyxPQUFMLENBQWEscUJBQWIsQ0FBbUMsQ0FBbkMsQ0FBZjtBQUNBLFFBQUksU0FBUyxLQUFLLE9BQUwsQ0FBYSxtQkFBYixDQUFpQyxDQUFqQyxDQUFiOztBQUVBLFVBQU0sT0FBTixDQUFjLFFBQWQ7QUFDQSxhQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7QUFDQSxhQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7O0FBRUEsV0FBTyxNQUFQO0FBQ0Q7QUFWUyxDQUFaIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5BdWRpb0NvbnRleHQgPSB3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQ7XG5cbldhdmUuY29udGV4dCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpO1xuXG5mdW5jdGlvbiBXYXZlIChzZWxlY3RvciwgY29udGV4dCkge1xuICByZXR1cm4gbmV3IFdhdmUuZm4uaW5pdChzZWxlY3RvciwgY29udGV4dCk7XG59XG5cbldhdmUuZm4gPSBXYXZlLnByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3I6IFdhdmUsXG4gIGxlbmd0aDogMCxcblxuICBjb250ZXh0OiBXYXZlLmNvbnRleHQsXG5cbiAgc3RhcnQ6IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgdGhpcy5nZXQoMCkuc3RhcnQodGltZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBjb25uZWN0OiBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgbGFzdE5vZGUgPSB0aGlzLmxhc3QoKTtcbiAgICB2YXIgbm9kZTtcbiAgICBpZiAobGFzdE5vZGUpIHtcbiAgICAgIG5vZGUgPSB0aGlzLmNvbnN0cnVjdG9yKHNlbGVjdG9yLCBjb250ZXh0IHx8IHt9KTtcblxuICAgICAgbGFzdE5vZGUuZ2V0KDApLmNvbm5lY3Qobm9kZS5nZXQoMCkpO1xuICAgICAgdGhpcy5wdXNoKG5vZGUuZ2V0KDApKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBkaXNjb25uZWN0OiBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIG5vZGUuZGlzY29ubmVjdC5hcHBseShub2RlLCBhcmdzKTtcbiAgICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBkZXN0aW5hdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBsYXN0Tm9kZSA9IHRoaXMubGFzdCgpO1xuICAgIGlmIChsYXN0Tm9kZSkge1xuICAgICAgbGFzdE5vZGUuZ2V0KDApLmNvbm5lY3QodGhpcy5jb250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignTm8gQXVkaW9Ob2RlIGNvbm5lY3QgdG8gb3V0cHV0LicpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGF0dHI6IGZ1bmN0aW9uIChub2RlLCBhdHRycykge1xuICAgIGZvciAobGV0IHBhcmFtIGluIGF0dHJzKSB7XG4gICAgICBsZXQgdmFsdWUgPSBhdHRyc1twYXJhbV07XG4gICAgICBpZiAobm9kZVtwYXJhbV0gaW5zdGFuY2VvZiBBdWRpb1BhcmFtKSB7XG4gICAgICAgIG5vZGVbcGFyYW1dLnZhbHVlID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlW3BhcmFtXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXEoLTEpO1xuICB9LFxuXG4gIGdldDogZnVuY3Rpb24gKG51bSkge1xuICAgIGlmIChudW0gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHNsaWNlLmNhbGwoIHRoaXMgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVtIDwgMCA/IHRoaXNbbnVtICsgdGhpcy5sZW5ndGhdIDogdGhpc1tudW1dO1xuICB9LFxuXG4gIGVxOiBmdW5jdGlvbiAoaSkge1xuICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aCxcbiAgICAgIGogPSAraSArICggaSA8IDAgPyBsZW4gOiAwICk7XG4gICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKCBqID49IDAgJiYgaiA8IGxlbiA/IFt0aGlzW2pdXSA6IFtdICk7XG4gIH0sXG5cbiAgcHVzaFN0YWNrOiBmdW5jdGlvbiAoZWxlbXMpIHtcbiAgICB2YXIgcmV0ID0gV2F2ZS5tZXJnZSh0aGlzLmNvbnN0cnVjdG9yKCksIGVsZW1zKTtcbiAgICByZXQucHJldk9iamVjdCA9IHRoaXM7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIGVhY2g6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHJldHVybiBXYXZlLmVhY2godGhpcywgY2FsbGJhY2spO1xuICB9LFxuXG4gIG1hcDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKFdhdmUubWFwKHRoaXMsIGZ1bmN0aW9uKGVsZW0sIGkpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGVsZW0sIGksIGVsZW0pO1xuICAgIH0pKTtcbiAgfSxcblxuICBwdXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmZvckVhY2goKGFyZykgPT4ge1xuICAgICAgdGhpc1t0aGlzLmxlbmd0aF0gPSBhcmc7XG4gICAgICB0aGlzLmxlbmd0aCsrO1xuICAgIH0pXG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgc3BsaWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zcGxpY2U7XG4gIH0sXG4gIGluZGV4T2Y6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2Y7XG4gIH1cbn1cblxuV2F2ZS5leHRlbmQgPSBXYXZlLmZuLmV4dGVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLFxuICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICBpID0gMSxcbiAgICBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLFxuICAgIGRlZXAgPSBmYWxzZTtcblxuICAvLyBIYW5kbGUgYSBkZWVwIGNvcHkgc2l0dWF0aW9uXG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcImJvb2xlYW5cIikge1xuICAgIGRlZXAgPSB0YXJnZXQ7XG5cbiAgICAvLyBTa2lwIHRoZSBib29sZWFuIGFuZCB0aGUgdGFyZ2V0XG4gICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldIHx8IHt9O1xuICAgIGkrKztcbiAgfVxuXG4gIC8vIEhhbmRsZSBjYXNlIHdoZW4gdGFyZ2V0IGlzIGEgc3RyaW5nIG9yIHNvbWV0aGluZyAocG9zc2libGUgaW4gZGVlcCBjb3B5KVxuICBpZiAodHlwZW9mIHRhcmdldCAhPT0gXCJvYmplY3RcIiAmJiAhV2F2ZS5pc0Z1bmN0aW9uKHRhcmdldCkpIHtcbiAgICB0YXJnZXQgPSB7fTtcbiAgfVxuXG4gIC8vIEV4dGVuZCBXYXZlIGl0c2VsZiBpZiBvbmx5IG9uZSBhcmd1bWVudCBpcyBwYXNzZWRcbiAgaWYgKGkgPT09IGxlbmd0aCkge1xuICAgIHRhcmdldCA9IHRoaXM7XG4gICAgaS0tO1xuICB9XG5cbiAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuXG4gICAgLy8gT25seSBkZWFsIHdpdGggbm9uLW51bGwvdW5kZWZpbmVkIHZhbHVlc1xuICAgIGlmICggKCBvcHRpb25zID0gYXJndW1lbnRzWyBpIF0gKSAhPSBudWxsICkge1xuXG4gICAgICAvLyBFeHRlbmQgdGhlIGJhc2Ugb2JqZWN0XG4gICAgICBmb3IgKCBuYW1lIGluIG9wdGlvbnMgKSB7XG4gICAgICAgIHNyYyA9IHRhcmdldFsgbmFtZSBdO1xuICAgICAgICBjb3B5ID0gb3B0aW9uc1sgbmFtZSBdO1xuXG4gICAgICAgIC8vIFByZXZlbnQgbmV2ZXItZW5kaW5nIGxvb3BcbiAgICAgICAgaWYgKCB0YXJnZXQgPT09IGNvcHkgKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZWN1cnNlIGlmIHdlJ3JlIG1lcmdpbmcgcGxhaW4gb2JqZWN0cyBvciBhcnJheXNcbiAgICAgICAgaWYgKCBkZWVwICYmIGNvcHkgJiYgKCBXYXZlLmlzUGxhaW5PYmplY3QoIGNvcHkgKSB8fFxuICAgICAgICAgICggY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KCBjb3B5ICkgKSApICkge1xuXG4gICAgICAgICAgaWYgKCBjb3B5SXNBcnJheSApIHtcbiAgICAgICAgICAgIGNvcHlJc0FycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KCBzcmMgKSA/IHNyYyA6IFtdO1xuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsb25lID0gc3JjICYmIFdhdmUuaXNQbGFpbk9iamVjdCggc3JjICkgPyBzcmMgOiB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOZXZlciBtb3ZlIG9yaWdpbmFsIG9iamVjdHMsIGNsb25lIHRoZW1cbiAgICAgICAgICB0YXJnZXRbIG5hbWUgXSA9IFdhdmUuZXh0ZW5kKCBkZWVwLCBjbG9uZSwgY29weSApO1xuXG4gICAgICAgIC8vIERvbid0IGJyaW5nIGluIHVuZGVmaW5lZCB2YWx1ZXNcbiAgICAgICAgfSBlbHNlIGlmICggY29weSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIHRhcmdldFsgbmFtZSBdID0gY29weTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgbW9kaWZpZWQgb2JqZWN0XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG5XYXZlLmV4dGVuZCh7XG4gIG1lcmdlOiBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgdmFyIGxlbiA9ICtzZWNvbmQubGVuZ3RoLFxuICAgICAgaiA9IDAsXG4gICAgICBpID0gZmlyc3QubGVuZ3RoO1xuXG4gICAgZm9yICg7IGogPCBsZW47IGorKykge1xuICAgICAgZmlyc3RbaSsrXSA9IHNlY29uZFtqXTtcbiAgICB9XG5cbiAgICBmaXJzdC5sZW5ndGggPSBpO1xuXG4gICAgcmV0dXJuIGZpcnN0O1xuICB9LFxuICBtYWtlQXJyYXk6IGZ1bmN0aW9uIChhcnIsIHJlc3VsdHMpIHtcbiAgICB2YXIgcmV0ID0gcmVzdWx0cyB8fCBbXTtcblxuICAgIGlmIChhcnIgIT0gbnVsbCkge1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKE9iamVjdChhcnIpKSkge1xuICAgICAgICBqUXVlcnkubWVyZ2UocmV0LFxuICAgICAgICAgIHR5cGVvZiBhcnIgPT09IFwic3RyaW5nXCIgP1xuICAgICAgICAgIFthcnJdIDogYXJyXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwdXNoLmNhbGwocmV0LCBhcnIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cbn0pO1xuXG52YXIgcnF1aWNrRXhwciA9IC9eKD86XFxzKihbXFx3XFxXXSspIyhbXFx3LV0rKSkkLztcblxudmFyIG5vZGVNYXAgPSB7XG4gIC8vIGF1ZGlvTm9kZTogJ0F1ZGlvTm9kZScsXG4gIC8vIGF1ZGlvUGFyYW06ICdBdWRpb1BhcmFtJyxcbiAgLy8gYXVkaW9Qcm9jZXNzaW5nRXZlbnQ6ICdBdWRpb1Byb2Nlc3NpbmdFdmVudCcsXG4gIC8vIG9mZmxpbmVBdWRpb0NvbXBsZXRpb25FdmVudDogJ09mZmxpbmVBdWRpb0NvbXBsZXRpb25FdmVudCcsXG4gIGFuYWx5c2VyOiAnQW5hbHlzZXJOb2RlJyxcbiAgYXVkaW9CdWZmZXI6ICdBdWRpb0J1ZmZlcicsXG4gIGF1ZGlvQnVmZmVyU291cmNlOiAnQXVkaW9CdWZmZXJTb3VyY2VOb2RlJyxcbiAgYXVkaW9Db250ZXh0OiAnQXVkaW9Db250ZXh0JyxcbiAgYXVkaW9EZXN0aW5hdGlvbjogJ0F1ZGlvRGVzdGluYXRpb25Ob2RlJyxcbiAgYXVkaW9MaXN0ZW5lcjogJ0F1ZGlvTGlzdGVuZXInLFxuICBiaXF1YWRGaWx0ZXI6ICdCaXF1YWRGaWx0ZXJOb2RlJyxcbiAgY2hhbm5lbE1lcmdlcjogJ0NoYW5uZWxNZXJnZXJOb2RlJyxcbiAgY2hhbm5lbFNwbGl0dGVyOiAnQ2hhbm5lbFNwbGl0dGVyTm9kZScsXG4gIGNvbnN0YW50U291cmNlOiAnQ29uc3RhbnRTb3VyY2VOb2RlJyxcbiAgY29udm9sdmVyOiAnQ29udm9sdmVyTm9kZScsXG4gIGRlbGF5OiAnRGVsYXlOb2RlJyxcbiAgZHluYW1pY3NDb21wcmVzc29yOiAnRHluYW1pY3NDb21wcmVzc29yTm9kZScsXG4gIGdhaW46ICdHYWluTm9kZScsXG4gIElJUkZpbHRlcjogJ0lJUkZpbHRlck5vZGUnLFxuICBtZWRpYUVsZW1lbnRBdWRpb1NvdXJjZTogJ01lZGlhRWxlbWVudEF1ZGlvU291cmNlTm9kZScsXG4gIG1lZGlhU3RyZWFtQXVkaW9EZXN0aW5hdGlvbjogJ01lZGlhU3RyZWFtQXVkaW9EZXN0aW5hdGlvbk5vZGUnLFxuICBtZWRpYVN0cmVhbUF1ZGlvU291cmNlOiAnTWVkaWFTdHJlYW1BdWRpb1NvdXJjZU5vZGUnLFxuICBvZmZsaW5lQXVkaW9Db250ZXh0OiAnT2ZmbGluZUF1ZGlvQ29udGV4dCcsXG4gIG9zY2lsbGF0b3I6ICdPc2NpbGxhdG9yTm9kZScsXG4gIHBhbm5lcjogJ1Bhbm5lck5vZGUnLFxuICBwZXJpb2RpY1dhdmU6ICdQZXJpb2RpY1dhdmUnLFxuICBzdGVyZW9QYW5uZXI6ICdTdGVyZW9QYW5uZXJOb2RlJyxcbiAgd2F2ZVNoYXBlcjogJ1dhdmVTaGFwZXJOb2RlJyxcblxuICBjb21wcmVzc29yOiAnRHluYW1pY3NDb21wcmVzc29yTm9kZScsXG4gIGZpbHRlcjogJ0JpcXVhZEZpbHRlck5vZGUnLFxuICBpaXI6ICdJSVJGaWx0ZXJOb2RlJyxcbiAgbWVyZ2VyOiAnQ2hhbm5lbE1lcmdlck5vZGUnLFxuICBzaGFwZXI6ICdXYXZlU2hhcGVyTm9kZScsXG4gIHNwbGl0dGVyOiAnQ2hhbm5lbFNwbGl0dGVyTm9kZScsXG59O1xuXG52YXIgQU5NID0ge1xuICBub2RlVGFibGU6IHt9LFxuICBzZXQ6IGZ1bmN0aW9uIChpZCwgbm9kZSkge1xuICAgIHRoaXMubm9kZVRhYmxlW2lkXSA9IG5vZGU7XG4gIH0sXG4gIGZpbmQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiB0aGlzLm5vZGVUYWJsZVtpZF0gfHwgbnVsbDtcbiAgfVxufTtcblxudmFyIGluaXQgPSBXYXZlLmZuLmluaXQgPSBmdW5jdGlvbihzZWxlY3RvciwgY29udGV4dCkge1xuICBpZiAoIXNlbGVjdG9yKSB7IHJldHVybiB0aGlzOyB9XG5cbiAgdmFyIG1hdGNoO1xuXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHNlbGVjdG9yWzBdID09PSAnIycpIHtcbiAgICAgIC8vIGdldCBleGlzdGluZyBub2RlXG4gICAgICBtYXRjaCA9IFtudWxsLCBudWxsLCBzZWxlY3Rvci5zbGljZSgxKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNyZWF0ZSBub2RlIHdpdGggaWRcbiAgICAgIG1hdGNoID0gcnF1aWNrRXhwci5leGVjKHNlbGVjdG9yKTtcbiAgICB9XG4gIH1cblxuICBpZiAobWF0Y2ggJiYgKG1hdGNoWzFdIHx8ICFjb250ZXh0KSkge1xuXG4gICAgLy8gd2F2ZSggJ25vZGUjaWQnIClcbiAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgIHZhciBub2RlTmFtZSA9IG5vZGVNYXBbbWF0Y2hbMV1dO1xuXG4gICAgICBpZiAobm9kZU5hbWUpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgd2luZG93W25vZGVOYW1lXSh0aGlzLmNvbnRleHQsIGNvbnRleHQgfHwge30pO1xuXG4gICAgICAgIC8vIGFzc2lnbiB0aGUgbm9kZSB0byBBTk0gd2l0aCBpZFxuICAgICAgICBBTk0uc2V0KG1hdGNoWzJdLCBub2RlKTtcblxuICAgICAgICB0aGlzWzBdID0gbm9kZTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3YXZlKCAnI2lkJyApXG4gICAgICB2YXIgbm9kZSA9IEFOTS5maW5kKG1hdGNoWzJdKTtcblxuICAgICAgdGhpc1swXSA9IG5vZGU7XG4gICAgICB0aGlzLmxlbmd0aCA9IDE7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSBlbHNlIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEF1ZGlvTm9kZSkge1xuICAgIC8vIHdhdmUoIEF1ZGlvTm9kZSApXG4gICAgICB0aGlzWzBdID0gc2VsZWN0b3I7XG4gICAgICB0aGlzLmxlbmd0aCA9IDE7XG4gICAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiBXYXZlLm1ha2VBcnJheShzZWxlY3RvciwgdGhpcyk7XG59XG5cbmluaXQucHJvdG90eXBlID0gV2F2ZS5mbjtcblxud2luZG93LldhdmUgPSBXYXZlO1xuXG4vLyBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBXYXZlOyIsIldhdmUuZXh0ZW5kKHtcbiAgY29udmVydFRvTW9ubzogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICB2YXIgc3BsaXR0ZXIgPSB0aGlzLmNvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDIpO1xuICAgIHZhciBtZXJnZXIgPSB0aGlzLmNvbnRleHQuY3JlYXRlQ2hhbm5lbE1lcmdlcigyKTtcblxuICAgIGlucHV0LmNvbm5lY3Qoc3BsaXR0ZXIpO1xuICAgIHNwbGl0dGVyLmNvbm5lY3QobWVyZ2VyLCAwLCAwKTtcbiAgICBzcGxpdHRlci5jb25uZWN0KG1lcmdlciwgMCwgMSk7XG5cbiAgICByZXR1cm4gbWVyZ2VyO1xuICB9XG59KTtcbiJdfQ==
