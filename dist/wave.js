(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (classToType, AudioContext) {
    wave.context = new AudioContext();
    function wave(selector, context) {
        return new wave.fn.init(selector, context);
    }
    wave.fn = wave.prototype = {
        constructor: wave,
        length: 0,
        context: wave.context,
        start: function start(time) {
            this.get(0).start(time);
            return this;
        },
        connect: function connect(selector, context) {
            var lastNode = this.get(-1);
            var node;
            if (lastNode) {
                node = this.constructor(selector, context || {});
                if (wave.isFunction(lastNode.connect)) {
                    lastNode.connect(node.get(0));
                }
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
            var ret = wave.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
        },
        each: function each(callback) {
            return wave.each(this, callback);
        },
        map: function map(callback) {
            return this.pushStack(wave.map(this, function (elem, i) {
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
    wave.extend = wave.fn.extend = function () {
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
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && !wave.isFunction(target)) {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (wave.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && wave.isPlainObject(src) ? src : {};
                        }
                        target[name] = wave.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    wave.extend({
        type: function type(obj) {
            if (obj == null) {
                return obj + '';
            }
            return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function' ? classToType[{}.toString.call(obj)] || 'object' : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
        },
        isFunction: function isFunction(obj) {
            return typeof obj === 'function' && typeof obj.nodeType !== 'number';
        },
        isArrayLike: function isArrayLike(obj) {
            var length = !!obj && 'length' in obj && obj.length,
                type = wave.type(obj);
            if (wave.isFunction(obj)) {
                return false;
            }
            return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
        },
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
                    wave.merge(ret, typeof arr === 'string' ? [arr] : arr);
                } else {
                    Array.prototype.push.call(ret, arr);
                }
            }
            return ret;
        }
    });
    return wave;
}(require('./var/classToType'), require('./core/var/audio-context'));

},{"./core/var/audio-context":5,"./var/classToType":8}],2:[function(require,module,exports){
"use strict";

module.exports = function () {
    var nodeTable = {};
    return {
        set: function set(id, node) {
            nodeTable[id] = node;
        },
        get: function get(id) {
            return nodeTable[id] || null;
        }
    };
}();

},{}],3:[function(require,module,exports){
'use strict';

module.exports = function (wave, nodeMap, ANM) {
    var rquickExpr = /^(?:\s*([\w\W]+)#([\w-]+))$/;
    var init = wave.fn.init = function (selector, context) {
        if (!selector) {
            return this;
        }
        var match;
        if (typeof selector === 'string') {
            if (selector[0] === '#') {
                match = [null, null, selector.slice(1)];
            } else {
                match = rquickExpr.exec(selector);
            }
        }
        if (match && (match[1] || !context)) {
            if (match[1]) {
                var nodeName = nodeMap[match[1]];
                if (nodeName) {
                    var node = new window[nodeName](this.context, context || {});
                    ANM.set(match[2], node);
                    this[0] = node;
                    this.length = 1;
                    return this;
                }
            } else {
                var node = ANM.get(match[2]);
                this[0] = node;
                this.length = 1;
                return this;
            }
        } else if (selector instanceof AudioNode) {
            this[0] = selector;
            this.length = 1;
            return this;
        }
        return wave.makeArray(selector, this);
    };
    init.prototype = wave.fn;
    return init;
}(require('../core'), require('./var/node-map'), require('./audio-node-module'));

},{"../core":1,"./audio-node-module":2,"./var/node-map":6}],4:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    wave.fn.extend({
        convertToMono: function convertToMono(input) {
            var splitter = this.context.createChannelSplitter(2);
            var merger = this.context.createChannelMerger(2);
            input.connect(splitter);
            splitter.connect(merger, 0, 0);
            splitter.connect(merger, 0, 1);
            return merger;
        }
    });
    return wave;
}(require('../core'));

},{"../core":1}],5:[function(require,module,exports){
'use strict';

module.exports = function () {
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
    };
}();

},{}],6:[function(require,module,exports){
'use strict';

module.exports = function () {
    return {
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
}();

},{}],7:[function(require,module,exports){
'use strict';

(function (wave) {
    'use strict';

    window.wave = window.w = wave;
})(require('../core'));

},{"../core":1}],8:[function(require,module,exports){
'use strict';

module.exports = function () {
    'use strict';

    var classes = 'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ');
    return classes.reduce(function (types, name) {
        types['[object ' + name + ']'] = name.toLowerCase();
        return types;
    }, {});
}();

},{}],9:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    return wave;
}(require('./core'), require('./core/init'), require('./core/mono'), require('./exports/global'));

},{"./core":1,"./core/init":3,"./core/mono":4,"./exports/global":7}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jb3JlLmpzIiwic3JjL2NvcmUvYXVkaW8tbm9kZS1tb2R1bGUuanMiLCJzcmMvY29yZS9pbml0LmpzIiwic3JjL2NvcmUvbW9uby5qcyIsInNyYy9jb3JlL3Zhci9hdWRpby1jb250ZXh0LmpzIiwic3JjL2NvcmUvdmFyL25vZGUtbWFwLmpzIiwic3JjL2V4cG9ydHMvZ2xvYmFsLmpzIiwic3JjL3Zhci9jbGFzc1RvVHlwZS5qcyIsInNyYy93YXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFVLFdBQVYsRUFBdUIsWUFBdkIsRUFBcUM7QUFDbEQsU0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxhQUFTLElBQVQsQ0FBYyxRQUFkLEVBQXdCLE9BQXhCLEVBQWlDO0FBQzdCLGVBQU8sSUFBSSxLQUFLLEVBQUwsQ0FBUSxJQUFaLENBQWlCLFFBQWpCLEVBQTJCLE9BQTNCLENBQVA7QUFDSDtBQUNELFNBQUssRUFBTCxHQUFVLEtBQUssU0FBTCxHQUFpQjtBQUN2QixxQkFBYSxJQURVO0FBRXZCLGdCQUFRLENBRmU7QUFHdkIsaUJBQVMsS0FBSyxPQUhTO0FBSXZCLGVBQU8sZUFBVSxJQUFWLEVBQWdCO0FBQ25CLGlCQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBWixDQUFrQixJQUFsQjtBQUNBLG1CQUFPLElBQVA7QUFDSCxTQVBzQjtBQVF2QixpQkFBUyxpQkFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCO0FBQ2xDLGdCQUFJLFdBQVcsS0FBSyxHQUFMLENBQVMsQ0FBQyxDQUFWLENBQWY7QUFDQSxnQkFBSSxJQUFKO0FBQ0EsZ0JBQUksUUFBSixFQUFjO0FBQ1YsdUJBQU8sS0FBSyxXQUFMLENBQWlC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QU8sT0FBUCxHQUFpQixZQUFZO0FBQ3pCOztBQUNBLFFBQUksVUFBVSx1RUFBdUUsS0FBdkUsQ0FBNkUsR0FBN0UsQ0FBZDtBQUNBLFdBQU8sUUFBUSxNQUFSLENBQWUsVUFBVSxLQUFWLEVBQWlCLElBQWpCLEVBQXVCO0FBQ3pDLGNBQU0sYUFBYSxJQUFiLEdBQW9CLEdBQTFCLElBQWlDLEtBQUssV0FBTCxFQUFqQztBQUNBLGVBQU8sS0FBUDtBQUNILEtBSE0sRUFHSixFQUhJLENBQVA7QUFJSCxDQVBnQixFQUFqQjs7Ozs7QUNBQSxPQUFPLE9BQVAsR0FBaUIsVUFBVSxJQUFWLEVBQWdCO0FBQzdCLFdBQU8sSUFBUDtBQUNILENBRmdCLENBRWYsUUFBUSxRQUFSLENBRmUsRUFFSSxRQUFRLGFBQVIsQ0FGSixFQUU0QixRQUFRLGFBQVIsQ0FGNUIsRUFFb0QsUUFBUSxrQkFBUixDQUZwRCxDQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjbGFzc1RvVHlwZSwgQXVkaW9Db250ZXh0KSB7XG4gICAgd2F2ZS5jb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIGZ1bmN0aW9uIHdhdmUoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB3YXZlLmZuLmluaXQoc2VsZWN0b3IsIGNvbnRleHQpO1xuICAgIH1cbiAgICB3YXZlLmZuID0gd2F2ZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB3YXZlLFxuICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgIGNvbnRleHQ6IHdhdmUuY29udGV4dCxcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICAgICAgICB0aGlzLmdldCgwKS5zdGFydCh0aW1lKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBjb25uZWN0OiBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgICAgIHZhciBsYXN0Tm9kZSA9IHRoaXMuZ2V0KC0xKTtcbiAgICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgICAgaWYgKGxhc3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IHRoaXMuY29uc3RydWN0b3Ioc2VsZWN0b3IsIGNvbnRleHQgfHwge30pO1xuICAgICAgICAgICAgICAgIGlmICh3YXZlLmlzRnVuY3Rpb24obGFzdE5vZGUuY29ubmVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdE5vZGUuY29ubmVjdChub2RlLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHVzaChub2RlLmdldCgwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKG5vZGUpO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIG5vZGUuZGlzY29ubmVjdC5hcHBseShub2RlLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgZGVzdGluYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsYXN0Tm9kZSA9IHRoaXMubGFzdCgpO1xuICAgICAgICAgICAgaWYgKGxhc3ROb2RlKSB7XG4gICAgICAgICAgICAgICAgbGFzdE5vZGUuZ2V0KDApLmNvbm5lY3QodGhpcy5jb250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignTm8gQXVkaW9Ob2RlIGNvbm5lY3QgdG8gb3V0cHV0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGF0dHI6IGZ1bmN0aW9uIChub2RlLCBhdHRycykge1xuICAgICAgICAgICAgZm9yIChsZXQgcGFyYW0gaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhdHRyc1twYXJhbV07XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVbcGFyYW1dIGluc3RhbmNlb2YgQXVkaW9QYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlW3BhcmFtXS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVbcGFyYW1dID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcSgtMSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldDogZnVuY3Rpb24gKG51bSkge1xuICAgICAgICAgICAgaWYgKG51bSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsaWNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVtIDwgMCA/IHRoaXNbbnVtICsgdGhpcy5sZW5ndGhdIDogdGhpc1tudW1dO1xuICAgICAgICB9LFxuICAgICAgICBlcTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aCwgaiA9ICtpICsgKGkgPCAwID8gbGVuIDogMCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wdXNoU3RhY2soaiA+PSAwICYmIGogPCBsZW4gPyBbdGhpc1tqXV0gOiBbXSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1c2hTdGFjazogZnVuY3Rpb24gKGVsZW1zKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gd2F2ZS5tZXJnZSh0aGlzLmNvbnN0cnVjdG9yKCksIGVsZW1zKTtcbiAgICAgICAgICAgIHJldC5wcmV2T2JqZWN0ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVhY2g6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIHdhdmUuZWFjaCh0aGlzLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIG1hcDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wdXNoU3RhY2sod2F2ZS5tYXAodGhpcywgZnVuY3Rpb24gKGVsZW0sIGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChlbGVtLCBpLCBlbGVtKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmZvckVhY2goYXJnID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzW3RoaXMubGVuZ3RoXSA9IGFyZztcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgc3BsaWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5kZXhPZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB3YXZlLmV4dGVuZCA9IHdhdmUuZm4uZXh0ZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb3B0aW9ucywgbmFtZSwgc3JjLCBjb3B5LCBjb3B5SXNBcnJheSwgY2xvbmUsIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSwgaSA9IDEsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGRlZXAgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgZGVlcCA9IHRhcmdldDtcbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1tpXSB8fCB7fTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgIXdhdmUuaXNGdW5jdGlvbih0YXJnZXQpKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICB0YXJnZXQgPSB0aGlzO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgob3B0aW9ucyA9IGFyZ3VtZW50c1tpXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IHRhcmdldFtuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgY29weSA9IG9wdGlvbnNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IGNvcHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWVwICYmIGNvcHkgJiYgKHdhdmUuaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvcHkpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3B5SXNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlJc0FycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgQXJyYXkuaXNBcnJheShzcmMpID8gc3JjIDogW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIHdhdmUuaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSB3YXZlLmV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY29weSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBjb3B5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbiAgICB3YXZlLmV4dGVuZCh7XG4gICAgICAgIHR5cGU6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmogKyAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nID8gY2xhc3NUb1R5cGVbe30udG9TdHJpbmcuY2FsbChvYmopXSB8fCAnb2JqZWN0JyA6IHR5cGVvZiBvYmo7XG4gICAgICAgIH0sXG4gICAgICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmoubm9kZVR5cGUgIT09ICdudW1iZXInO1xuICAgICAgICB9LFxuICAgICAgICBpc0FycmF5TGlrZTogZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9ICEhb2JqICYmICdsZW5ndGgnIGluIG9iaiAmJiBvYmoubGVuZ3RoLCB0eXBlID0gd2F2ZS50eXBlKG9iaik7XG4gICAgICAgICAgICBpZiAod2F2ZS5pc0Z1bmN0aW9uKG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gJ2FycmF5JyB8fCBsZW5ndGggPT09IDAgfHwgdHlwZW9mIGxlbmd0aCA9PT0gJ251bWJlcicgJiYgbGVuZ3RoID4gMCAmJiBsZW5ndGggLSAxIGluIG9iajtcbiAgICAgICAgfSxcbiAgICAgICAgbWVyZ2U6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICB2YXIgbGVuID0gK3NlY29uZC5sZW5ndGgsIGogPSAwLCBpID0gZmlyc3QubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZpcnN0W2krK10gPSBzZWNvbmRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaXJzdC5sZW5ndGggPSBpO1xuICAgICAgICAgICAgcmV0dXJuIGZpcnN0O1xuICAgICAgICB9LFxuICAgICAgICBtYWtlQXJyYXk6IGZ1bmN0aW9uIChhcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuICAgICAgICAgICAgaWYgKGFyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKE9iamVjdChhcnIpKSkge1xuICAgICAgICAgICAgICAgICAgICB3YXZlLm1lcmdlKHJldCwgdHlwZW9mIGFyciA9PT0gJ3N0cmluZycgPyBbYXJyXSA6IGFycik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChyZXQsIGFycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB3YXZlO1xufShyZXF1aXJlKCcuL3Zhci9jbGFzc1RvVHlwZScpLCByZXF1aXJlKCcuL2NvcmUvdmFyL2F1ZGlvLWNvbnRleHQnKSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vZGVUYWJsZSA9IHt9O1xuICAgIHJldHVybiB7XG4gICAgICAgIHNldDogZnVuY3Rpb24gKGlkLCBub2RlKSB7XG4gICAgICAgICAgICBub2RlVGFibGVbaWRdID0gbm9kZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlVGFibGVbaWRdIHx8IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xufSgpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHdhdmUsIG5vZGVNYXAsIEFOTSkge1xuICAgIHZhciBycXVpY2tFeHByID0gL14oPzpcXHMqKFtcXHdcXFddKykjKFtcXHctXSspKSQvO1xuICAgIHZhciBpbml0ID0gd2F2ZS5mbi5pbml0ID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXRjaDtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RvclswXSA9PT0gJyMnKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBbXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yLnNsaWNlKDEpXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBycXVpY2tFeHByLmV4ZWMoc2VsZWN0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaCAmJiAobWF0Y2hbMV0gfHwgIWNvbnRleHQpKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZU5hbWUgPSBub2RlTWFwW21hdGNoWzFdXTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBuZXcgd2luZG93W25vZGVOYW1lXSh0aGlzLmNvbnRleHQsIGNvbnRleHQgfHwge30pO1xuICAgICAgICAgICAgICAgICAgICBBTk0uc2V0KG1hdGNoWzJdLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1swXSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gMTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IEFOTS5nZXQobWF0Y2hbMl0pO1xuICAgICAgICAgICAgICAgIHRoaXNbMF0gPSBub2RlO1xuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIEF1ZGlvTm9kZSkge1xuICAgICAgICAgICAgdGhpc1swXSA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdhdmUubWFrZUFycmF5KHNlbGVjdG9yLCB0aGlzKTtcbiAgICB9O1xuICAgIGluaXQucHJvdG90eXBlID0gd2F2ZS5mbjtcbiAgICByZXR1cm4gaW5pdDtcbn0ocmVxdWlyZSgnLi4vY29yZScpLCByZXF1aXJlKCcuL3Zhci9ub2RlLW1hcCcpLCByZXF1aXJlKCcuL2F1ZGlvLW5vZGUtbW9kdWxlJykpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHdhdmUpIHtcbiAgICB3YXZlLmZuLmV4dGVuZCh7XG4gICAgICAgIGNvbnZlcnRUb01vbm86IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHNwbGl0dGVyID0gdGhpcy5jb250ZXh0LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigyKTtcbiAgICAgICAgICAgIHZhciBtZXJnZXIgPSB0aGlzLmNvbnRleHQuY3JlYXRlQ2hhbm5lbE1lcmdlcigyKTtcbiAgICAgICAgICAgIGlucHV0LmNvbm5lY3Qoc3BsaXR0ZXIpO1xuICAgICAgICAgICAgc3BsaXR0ZXIuY29ubmVjdChtZXJnZXIsIDAsIDApO1xuICAgICAgICAgICAgc3BsaXR0ZXIuY29ubmVjdChtZXJnZXIsIDAsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIG1lcmdlcjtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB3YXZlO1xufShyZXF1aXJlKCcuLi9jb3JlJykpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgX2NhY2hlID0ge307XG4gICAgdmFyIEF1ZGlvQ29udGV4dCwgT2ZmbGluZUF1ZGlvQ29udGV4dDtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgQXVkaW9Db250ZXh0ID0gd2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0O1xuICAgICAgICBPZmZsaW5lQXVkaW9Db250ZXh0ID0gd2luZG93Lk9mZmxpbmVBdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdE9mZmxpbmVBdWRpb0NvbnRleHQ7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBpZiAoIUF1ZGlvQ29udGV4dClcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgdmFyIHNhbXBsZVJhdGUgPSBvcHRpb25zLnNhbXBsZVJhdGUgfHwgNDQxMDA7XG4gICAgICAgIHZhciBjb250ZXh0ID0gX2NhY2hlW3NhbXBsZVJhdGVdO1xuICAgICAgICBpZiAoY29udGV4dClcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgICAgICBpZiAob3B0aW9ucy5vZmZsaW5lKSB7XG4gICAgICAgICAgICBpZiAoIU9mZmxpbmVBdWRpb0NvbnRleHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9mZmxpbmVBdWRpb0NvbnRleHQob3B0aW9ucy5jaGFubmVscyB8fCAyLCBvcHRpb25zLmxlbmd0aCwgc2FtcGxlUmF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KG9wdGlvbnMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIF9jYWNoZVtzYW1wbGVSYXRlXSA9IGNvbnRleHQ7XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH07XG59KCk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYW5hbHlzZXI6ICdBbmFseXNlck5vZGUnLFxuICAgICAgICBhdWRpb0J1ZmZlcjogJ0F1ZGlvQnVmZmVyJyxcbiAgICAgICAgYXVkaW9CdWZmZXJTb3VyY2U6ICdBdWRpb0J1ZmZlclNvdXJjZU5vZGUnLFxuICAgICAgICBhdWRpb0NvbnRleHQ6ICdBdWRpb0NvbnRleHQnLFxuICAgICAgICBhdWRpb0Rlc3RpbmF0aW9uOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLFxuICAgICAgICBhdWRpb0xpc3RlbmVyOiAnQXVkaW9MaXN0ZW5lcicsXG4gICAgICAgIGJpcXVhZEZpbHRlcjogJ0JpcXVhZEZpbHRlck5vZGUnLFxuICAgICAgICBjaGFubmVsTWVyZ2VyOiAnQ2hhbm5lbE1lcmdlck5vZGUnLFxuICAgICAgICBjaGFubmVsU3BsaXR0ZXI6ICdDaGFubmVsU3BsaXR0ZXJOb2RlJyxcbiAgICAgICAgY29uc3RhbnRTb3VyY2U6ICdDb25zdGFudFNvdXJjZU5vZGUnLFxuICAgICAgICBjb252b2x2ZXI6ICdDb252b2x2ZXJOb2RlJyxcbiAgICAgICAgZGVsYXk6ICdEZWxheU5vZGUnLFxuICAgICAgICBkeW5hbWljc0NvbXByZXNzb3I6ICdEeW5hbWljc0NvbXByZXNzb3JOb2RlJyxcbiAgICAgICAgZ2FpbjogJ0dhaW5Ob2RlJyxcbiAgICAgICAgSUlSRmlsdGVyOiAnSUlSRmlsdGVyTm9kZScsXG4gICAgICAgIG1lZGlhRWxlbWVudEF1ZGlvU291cmNlOiAnTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlJyxcbiAgICAgICAgbWVkaWFTdHJlYW1BdWRpb0Rlc3RpbmF0aW9uOiAnTWVkaWFTdHJlYW1BdWRpb0Rlc3RpbmF0aW9uTm9kZScsXG4gICAgICAgIG1lZGlhU3RyZWFtQXVkaW9Tb3VyY2U6ICdNZWRpYVN0cmVhbUF1ZGlvU291cmNlTm9kZScsXG4gICAgICAgIG9mZmxpbmVBdWRpb0NvbnRleHQ6ICdPZmZsaW5lQXVkaW9Db250ZXh0JyxcbiAgICAgICAgb3NjaWxsYXRvcjogJ09zY2lsbGF0b3JOb2RlJyxcbiAgICAgICAgcGFubmVyOiAnUGFubmVyTm9kZScsXG4gICAgICAgIHBlcmlvZGljV2F2ZTogJ1BlcmlvZGljV2F2ZScsXG4gICAgICAgIHN0ZXJlb1Bhbm5lcjogJ1N0ZXJlb1Bhbm5lck5vZGUnLFxuICAgICAgICB3YXZlU2hhcGVyOiAnV2F2ZVNoYXBlck5vZGUnLFxuICAgICAgICBjb21wcmVzc29yOiAnRHluYW1pY3NDb21wcmVzc29yTm9kZScsXG4gICAgICAgIGZpbHRlcjogJ0JpcXVhZEZpbHRlck5vZGUnLFxuICAgICAgICBpaXI6ICdJSVJGaWx0ZXJOb2RlJyxcbiAgICAgICAgbWVyZ2VyOiAnQ2hhbm5lbE1lcmdlck5vZGUnLFxuICAgICAgICBzaGFwZXI6ICdXYXZlU2hhcGVyTm9kZScsXG4gICAgICAgIHNwbGl0dGVyOiAnQ2hhbm5lbFNwbGl0dGVyTm9kZSdcbiAgICB9O1xufSgpOyIsIihmdW5jdGlvbiAod2F2ZSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB3aW5kb3cud2F2ZSA9IHdpbmRvdy53ID0gd2F2ZTtcbn0ocmVxdWlyZSgnLi4vY29yZScpKSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBjbGFzc2VzID0gJ0Jvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3IgU3ltYm9sJy5zcGxpdCgnICcpO1xuICAgIHJldHVybiBjbGFzc2VzLnJlZHVjZShmdW5jdGlvbiAodHlwZXMsIG5hbWUpIHtcbiAgICAgICAgdHlwZXNbJ1tvYmplY3QgJyArIG5hbWUgKyAnXSddID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICByZXR1cm4gdHlwZXM7XG4gICAgfSwge30pO1xufSgpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHdhdmUpIHtcbiAgICByZXR1cm4gd2F2ZTtcbn0ocmVxdWlyZSgnLi9jb3JlJyksIHJlcXVpcmUoJy4vY29yZS9pbml0JyksIHJlcXVpcmUoJy4vY29yZS9tb25vJyksIHJlcXVpcmUoJy4vZXhwb3J0cy9nbG9iYWwnKSk7Il19
