(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (classToType, AudioContext, WaveCollection) {
    wave.context = new AudioContext();
    function wave(selector, context) {
        return new wave.fn.init(selector, context);
    }
    wave.fn = wave.prototype = {
        constructor: wave,
        length: 0,
        context: wave.context,
        connect: function connect(selector) {
            this[this.length - 1].connect(selector);
            return this;
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
                if (wave.isArrayLike(Object(arr))) {
                    wave.merge(ret, typeof arr === 'string' ? [arr] : arr);
                } else {
                    Array.prototype.push.call(ret, arr);
                }
            }
            return ret;
        }
    });
    return wave;
}(require('./core/var/classToType'), require('./core/var/audio-context'));

},{"./core/var/audio-context":5,"./core/var/classToType":6}],2:[function(require,module,exports){
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

module.exports = function (wave, nodeMap, ANM, WaveNode, WaveCollection) {
    var rquickExpr = /^(?:\s*([\w\W]+)#([\w-]+))$/;
    var init = wave.fn.init = function (selector, context) {
        if (!selector) {
            return this;
        }
        var match, waveNode;
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
                if (nodeName && window[nodeName]) {
                    var id = match[2];
                    var node = new window[nodeName](this.context, context || {});
                    waveNode = new WaveNode(id, node, this.context);
                    ANM.set(id, waveNode);
                }
            } else {
                waveNode = ANM.get(match[2]);
            }
        } else if (selector instanceof AudioNode) {
            waveNode = new WaveNode(id, selector, this.context);
        }
        return wave.makeArray(this, new WaveCollection(waveNode));
    };
    init.prototype = wave.fn;
    return init;
}(require('../core'), require('./var/node-map'), require('./audio-node-module'), require('./wave-node'), require('./wave-collection'));

},{"../core":1,"./audio-node-module":2,"./var/node-map":7,"./wave-collection":8,"./wave-node":9}],4:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    wave.fn.extend({
        toMono: function toMono(input) {
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
    'use strict';

    var classes = 'Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' ');
    return classes.reduce(function (types, name) {
        types['[object ' + name + ']'] = name.toLowerCase();
        return types;
    }, {});
}();

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    function WaveCollection(waveNode) {
        this[0] = waveNode;
        this.length = 1;
    }
    WaveCollection.prototype = {
        constructor: WaveCollection,
        length: 0,
        context: wave.context,
        connect: function connect(selector) {
            var node = this[this.length - 1].connect(selector);
            debugger;
            return this;
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
    return WaveCollection;
}(require('../core'));

},{"../core":1}],9:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    function WaveNode(id, node) {
        this.id = id;
        this.node = node;
        this.inputs = [];
        this.outputs = [];
    }
    function connect(inNode, outNode) {
        var args = [].slice.call(arguments, 2);
        if (inNode.node && outNode.node && wave.isFunction(inNode.node.connect) && outNode.node instanceof AudioNode) {
            inNode.node.connect.apply(inNode.node, [outNode.node].concat(args));
            inNode.outputs.push(outNode);
            outNode.inputs.push(inNode);
        }
        return outNode;
    }
    WaveNode.prototype = {
        constructor: WaveNode,
        context: wave.context,
        set: function set(params) {
            var node = this.node;
            for (var param in params) {
                var value = params[param];
                if (node[param] instanceof AudioParam) {
                    node[param].value = value;
                } else {
                    node[param] = value;
                }
            }
        },
        connect: function connect(selector, context) {
            if (wave.type(selector) === 'string') {
                selector = new wave(selector, context);
            }
            return this;
        },
        disconnect: function disconnect() {
            return this;
        },
        destination: function destination() {
            var node = new wave.fn.init(this.context.destination);
            connect(this, node);
            return this;
        },
        start: function start() {
            var node = this.node;
            if (wave.isFunction(node.start)) {
                node.start.apply(node, arguments);
            }
            return this;
        }
    };
    return WaveNode;
}(require('../core'));

},{"../core":1}],10:[function(require,module,exports){
'use strict';

(function (wave) {
    'use strict';

    window.wave = window.w = wave;
})(require('../core'));

},{"../core":1}],11:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    return wave;
}(require('./core'), require('./core/init'), require('./core/mono'), require('./exports/global'));

},{"./core":1,"./core/init":3,"./core/mono":4,"./exports/global":10}]},{},[11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jb3JlLmpzIiwic3JjL2NvcmUvYXVkaW8tbm9kZS1tb2R1bGUuanMiLCJzcmMvY29yZS9pbml0LmpzIiwic3JjL2NvcmUvbW9uby5qcyIsInNyYy9jb3JlL3Zhci9hdWRpby1jb250ZXh0LmpzIiwic3JjL2NvcmUvdmFyL2NsYXNzVG9UeXBlLmpzIiwic3JjL2NvcmUvdmFyL25vZGUtbWFwLmpzIiwic3JjL2NvcmUvd2F2ZS1jb2xsZWN0aW9uLmpzIiwic3JjL2NvcmUvd2F2ZS1ub2RlLmpzIiwic3JjL2V4cG9ydHMvZ2xvYmFsLmpzIiwic3JjL3dhdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsV0FBVixFQUF1QixZQUF2QixFQUFxQyxjQUFyQyxFQUFxRDtBQUNsRSxTQUFLLE9BQUwsR0FBZSxJQUFJLFlBQUosRUFBZjtBQUNBLGFBQVMsSUFBVCxDQUFjLFFBQWQsRUFBd0IsT0FBeEIsRUFBaUM7QUFDN0IsZUFBTyxJQUFJLEtBQUssRUFBTCxDQUFRLElBQVosQ0FBaUIsUUFBakIsRUFBMkIsT0FBM0IsQ0FBUDtBQUNIO0FBQ0QsU0FBSyxFQUFMLEdBQVUsS0FBSyxTQUFMLEdBQWlCO0FBQ3ZCLHFCQUFhLElBRFU7QUFFdkIsZ0JBQVEsQ0FGZTtBQUd2QixpQkFBUyxLQUFLLE9BSFM7QUFJdkIsaUJBQVMsaUJBQVUsUUFBVixFQUFvQjtBQUN6QixpQkFBSyxLQUFLLE1BQUwsR0FBYyxDQUFuQixFQUFzQixPQUF0QixDQUE4QixRQUE5QjtBQUNBLG1CQUFPLElBQVA7QUFDSCxTQVBzQjtBQVF2QixjQUFNLGdCQUFZO0FBQ2QsbUJBQU8sS0FBSyxFQUFMLENBQVEsQ0FBQyxDQUFULENBQVA7QUFDSCxTQVZzQjtB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QUFLLElBQUwsQ0FBVSxRQUFWLE1BQXdCLFFBQTVCLEVBQXNDO0FBQ2xDLDJCQUFXLElBQUksSUFBSixDQUFTLFFBQVQsRUFBbUIsT0FBbkIsQ0FBWDtBQUNIO0FBQ0QsbUJBQU8sSUFBUDtBQUNILFNBbkJnQjtBQW9CakIsb0JBQVksc0JBQVk7QUFDcEIsbUJBQU8sSUFBUDtBQUNILFNBdEJnQjtBQXVCakIscUJBQWEsdUJBQVk7QUFDckIsZ0JBQUksT0FBTyxJQUFJLEtBQUssRUFBTCxDQUFRLElBQVosQ0FBaUIsS0FBSyxPQUFMLENBQWEsV0FBOUIsQ0FBWDtBQUNBLG9CQUFRLElBQVIsRUFBYyxJQUFkO0FBQ0EsbUJBQU8sSUFBUDtBQUNILFNBM0JnQjtBQTRCakIsZUFBTyxpQkFBWTtBQUNmLGdCQUFJLE9BQU8sS0FBSyxJQUFoQjtBQUNBLGdCQUFJLEtBQUssVUFBTCxDQUFnQixLQUFLLEtBQXJCLENBQUosRUFBaUM7QUFDN0IscUJBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsSUFBakIsRUFBdUIsU0FBdkI7QUFDSDtBQUNELG1CQUFPLElBQVA7QUFDSDtBQWxDZ0IsS0FBckI7QUFvQ0EsV0FBTyxRQUFQO0FBQ0gsQ0FyRGdCLENBcURmLFFBQVEsU0FBUixDQXJEZSxDQUFqQjs7Ozs7QUNBQyxXQUFVLElBQVYsRUFBZ0I7QUFDYjs7QUFDQSxXQUFPLElBQVAsR0FBYyxPQUFPLENBQVAsR0FBVyxJQUF6QjtBQUNILENBSEEsRUFHQyxRQUFRLFNBQVIsQ0FIRCxDQUFEOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixVQUFVLElBQVYsRUFBZ0I7QUFDN0IsV0FBTyxJQUFQO0FBQ0gsQ0FGZ0IsQ0FFZixRQUFRLFFBQVIsQ0FGZSxFQUVJLFFBQVEsYUFBUixDQUZKLEVBRTRCLFFBQVEsYUFBUixDQUY1QixFQUVvRCxRQUFRLGtCQUFSLENBRnBELENBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNsYXNzVG9UeXBlLCBBdWRpb0NvbnRleHQsIFdhdmVDb2xsZWN0aW9uKSB7XG4gICAgd2F2ZS5jb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgIGZ1bmN0aW9uIHdhdmUoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB3YXZlLmZuLmluaXQoc2VsZWN0b3IsIGNvbnRleHQpO1xuICAgIH1cbiAgICB3YXZlLmZuID0gd2F2ZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB3YXZlLFxuICAgICAgICBsZW5ndGg6IDAsXG4gICAgICAgIGNvbnRleHQ6IHdhdmUuY29udGV4dCxcbiAgICAgICAgY29ubmVjdDogZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzW3RoaXMubGVuZ3RoIC0gMV0uY29ubmVjdChzZWxlY3Rvcik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgbGFzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXEoLTEpO1xuICAgICAgICB9LFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgICAgIGlmIChudW0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzbGljZS5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bSA8IDAgPyB0aGlzW251bSArIHRoaXMubGVuZ3RoXSA6IHRoaXNbbnVtXTtcbiAgICAgICAgfSxcbiAgICAgICAgZXE6IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICB2YXIgbGVuID0gdGhpcy5sZW5ndGgsIGogPSAraSArIChpIDwgMCA/IGxlbiA6IDApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKGogPj0gMCAmJiBqIDwgbGVuID8gW3RoaXNbal1dIDogW10pO1xuICAgICAgICB9LFxuICAgICAgICBwdXNoU3RhY2s6IGZ1bmN0aW9uIChlbGVtcykge1xuICAgICAgICAgICAgdmFyIHJldCA9IHdhdmUubWVyZ2UodGhpcy5jb25zdHJ1Y3RvcigpLCBlbGVtcyk7XG4gICAgICAgICAgICByZXQucHJldk9iamVjdCA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9LFxuICAgICAgICBlYWNoOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiB3YXZlLmVhY2godGhpcywgY2FsbGJhY2spO1xuICAgICAgICB9LFxuICAgICAgICBtYXA6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKHdhdmUubWFwKHRoaXMsIGZ1bmN0aW9uIChlbGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoZWxlbSwgaSwgZWxlbSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1c2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5mb3JFYWNoKGFyZyA9PiB7XG4gICAgICAgICAgICAgICAgdGhpc1t0aGlzLmxlbmd0aF0gPSBhcmc7XG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIHNwbGljZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zcGxpY2U7XG4gICAgICAgIH0sXG4gICAgICAgIGluZGV4T2Y6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuaW5kZXhPZjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgd2F2ZS5leHRlbmQgPSB3YXZlLmZuLmV4dGVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMsIG5hbWUsIHNyYywgY29weSwgY29weUlzQXJyYXksIGNsb25lLCB0YXJnZXQgPSBhcmd1bWVudHNbMF0gfHwge30sIGkgPSAxLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBkZWVwID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGRlZXAgPSB0YXJnZXQ7XG4gICAgICAgICAgICB0YXJnZXQgPSBhcmd1bWVudHNbaV0gfHwge307XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnICYmICF3YXZlLmlzRnVuY3Rpb24odGFyZ2V0KSkge1xuICAgICAgICAgICAgdGFyZ2V0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKG9wdGlvbnMgPSBhcmd1bWVudHNbaV0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBzcmMgPSB0YXJnZXRbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGNvcHkgPSBvcHRpb25zW25hbWVdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBjb3B5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVlcCAmJiBjb3B5ICYmICh3YXZlLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gQXJyYXkuaXNBcnJheShjb3B5KSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29weUlzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3B5SXNBcnJheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmIEFycmF5LmlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiB3YXZlLmlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdID0gd2F2ZS5leHRlbmQoZGVlcCwgY2xvbmUsIGNvcHkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdID0gY29weTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG4gICAgd2F2ZS5leHRlbmQoe1xuICAgICAgICB0eXBlOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqICsgJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyA/IGNsYXNzVG9UeXBlW3t9LnRvU3RyaW5nLmNhbGwob2JqKV0gfHwgJ29iamVjdCcgOiB0eXBlb2Ygb2JqO1xuICAgICAgICB9LFxuICAgICAgICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLm5vZGVUeXBlICE9PSAnbnVtYmVyJztcbiAgICAgICAgfSxcbiAgICAgICAgaXNBcnJheUxpa2U6IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSAhIW9iaiAmJiAnbGVuZ3RoJyBpbiBvYmogJiYgb2JqLmxlbmd0aCwgdHlwZSA9IHdhdmUudHlwZShvYmopO1xuICAgICAgICAgICAgaWYgKHdhdmUuaXNGdW5jdGlvbihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdhcnJheScgfHwgbGVuZ3RoID09PSAwIHx8IHR5cGVvZiBsZW5ndGggPT09ICdudW1iZXInICYmIGxlbmd0aCA+IDAgJiYgbGVuZ3RoIC0gMSBpbiBvYmo7XG4gICAgICAgIH0sXG4gICAgICAgIG1lcmdlOiBmdW5jdGlvbiAoZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgdmFyIGxlbiA9ICtzZWNvbmQubGVuZ3RoLCBqID0gMCwgaSA9IGZpcnN0Lmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2pdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlyc3QubGVuZ3RoID0gaTtcbiAgICAgICAgICAgIHJldHVybiBmaXJzdDtcbiAgICAgICAgfSxcbiAgICAgICAgbWFrZUFycmF5OiBmdW5jdGlvbiAoYXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gcmVzdWx0cyB8fCBbXTtcbiAgICAgICAgICAgIGlmIChhcnIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh3YXZlLmlzQXJyYXlMaWtlKE9iamVjdChhcnIpKSkge1xuICAgICAgICAgICAgICAgICAgICB3YXZlLm1lcmdlKHJldCwgdHlwZW9mIGFyciA9PT0gJ3N0cmluZycgPyBbYXJyXSA6IGFycik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChyZXQsIGFycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB3YXZlO1xufShyZXF1aXJlKCcuL2NvcmUvdmFyL2NsYXNzVG9UeXBlJyksIHJlcXVpcmUoJy4vY29yZS92YXIvYXVkaW8tY29udGV4dCcpKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm9kZVRhYmxlID0ge307XG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoaWQsIG5vZGUpIHtcbiAgICAgICAgICAgIG5vZGVUYWJsZVtpZF0gPSBub2RlO1xuICAgICAgICB9LFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVUYWJsZVtpZF0gfHwgbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59KCk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod2F2ZSwgbm9kZU1hcCwgQU5NLCBXYXZlTm9kZSwgV2F2ZUNvbGxlY3Rpb24pIHtcbiAgICB2YXIgcnF1aWNrRXhwciA9IC9eKD86XFxzKihbXFx3XFxXXSspIyhbXFx3LV0rKSkkLztcbiAgICB2YXIgaW5pdCA9IHdhdmUuZm4uaW5pdCA9IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICAgICAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF0Y2gsIHdhdmVOb2RlO1xuICAgICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yWzBdID09PSAnIycpIHtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IFtcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iuc2xpY2UoMSlcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyhzZWxlY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoICYmIChtYXRjaFsxXSB8fCAhY29udGV4dCkpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFsxXSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlTmFtZSA9IG5vZGVNYXBbbWF0Y2hbMV1dO1xuICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSAmJiB3aW5kb3dbbm9kZU5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IG1hdGNoWzJdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyB3aW5kb3dbbm9kZU5hbWVdKHRoaXMuY29udGV4dCwgY29udGV4dCB8fCB7fSk7XG4gICAgICAgICAgICAgICAgICAgIHdhdmVOb2RlID0gbmV3IFdhdmVOb2RlKGlkLCBub2RlLCB0aGlzLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICBBTk0uc2V0KGlkLCB3YXZlTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3YXZlTm9kZSA9IEFOTS5nZXQobWF0Y2hbMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgQXVkaW9Ob2RlKSB7XG4gICAgICAgICAgICB3YXZlTm9kZSA9IG5ldyBXYXZlTm9kZShpZCwgc2VsZWN0b3IsIHRoaXMuY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdhdmUubWFrZUFycmF5KHRoaXMsIG5ldyBXYXZlQ29sbGVjdGlvbih3YXZlTm9kZSkpO1xuICAgIH07XG4gICAgaW5pdC5wcm90b3R5cGUgPSB3YXZlLmZuO1xuICAgIHJldHVybiBpbml0O1xufShyZXF1aXJlKCcuLi9jb3JlJyksIHJlcXVpcmUoJy4vdmFyL25vZGUtbWFwJyksIHJlcXVpcmUoJy4vYXVkaW8tbm9kZS1tb2R1bGUnKSwgcmVxdWlyZSgnLi93YXZlLW5vZGUnKSwgcmVxdWlyZSgnLi93YXZlLWNvbGxlY3Rpb24nKSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod2F2ZSkge1xuICAgIHdhdmUuZm4uZXh0ZW5kKHtcbiAgICAgICAgdG9Nb25vOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBzcGxpdHRlciA9IHRoaXMuY29udGV4dC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIoMik7XG4gICAgICAgICAgICB2YXIgbWVyZ2VyID0gdGhpcy5jb250ZXh0LmNyZWF0ZUNoYW5uZWxNZXJnZXIoMik7XG4gICAgICAgICAgICBpbnB1dC5jb25uZWN0KHNwbGl0dGVyKTtcbiAgICAgICAgICAgIHNwbGl0dGVyLmNvbm5lY3QobWVyZ2VyLCAwLCAwKTtcbiAgICAgICAgICAgIHNwbGl0dGVyLmNvbm5lY3QobWVyZ2VyLCAwLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBtZXJnZXI7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gd2F2ZTtcbn0ocmVxdWlyZSgnLi4vY29yZScpKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIF9jYWNoZSA9IHt9O1xuICAgIHZhciBBdWRpb0NvbnRleHQsIE9mZmxpbmVBdWRpb0NvbnRleHQ7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIEF1ZGlvQ29udGV4dCA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICAgICAgT2ZmbGluZUF1ZGlvQ29udGV4dCA9IHdpbmRvdy5PZmZsaW5lQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRPZmZsaW5lQXVkaW9Db250ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFBdWRpb0NvbnRleHQpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHZhciBzYW1wbGVSYXRlID0gb3B0aW9ucy5zYW1wbGVSYXRlIHx8IDQ0MTAwO1xuICAgICAgICB2YXIgY29udGV4dCA9IF9jYWNoZVtzYW1wbGVSYXRlXTtcbiAgICAgICAgaWYgKGNvbnRleHQpXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgaWYgKG9wdGlvbnMub2ZmbGluZSkge1xuICAgICAgICAgICAgaWYgKCFPZmZsaW5lQXVkaW9Db250ZXh0KVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPZmZsaW5lQXVkaW9Db250ZXh0KG9wdGlvbnMuY2hhbm5lbHMgfHwgMiwgb3B0aW9ucy5sZW5ndGgsIHNhbXBsZVJhdGUpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dChvcHRpb25zKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICBfY2FjaGVbc2FtcGxlUmF0ZV0gPSBjb250ZXh0O1xuICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9O1xufSgpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgY2xhc3NlcyA9ICdCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0IEVycm9yIFN5bWJvbCcuc3BsaXQoJyAnKTtcbiAgICByZXR1cm4gY2xhc3Nlcy5yZWR1Y2UoZnVuY3Rpb24gKHR5cGVzLCBuYW1lKSB7XG4gICAgICAgIHR5cGVzWydbb2JqZWN0ICcgKyBuYW1lICsgJ10nXSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgcmV0dXJuIHR5cGVzO1xuICAgIH0sIHt9KTtcbn0oKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhbmFseXNlcjogJ0FuYWx5c2VyTm9kZScsXG4gICAgICAgIGF1ZGlvQnVmZmVyOiAnQXVkaW9CdWZmZXInLFxuICAgICAgICBhdWRpb0J1ZmZlclNvdXJjZTogJ0F1ZGlvQnVmZmVyU291cmNlTm9kZScsXG4gICAgICAgIGF1ZGlvQ29udGV4dDogJ0F1ZGlvQ29udGV4dCcsXG4gICAgICAgIGF1ZGlvRGVzdGluYXRpb246ICdBdWRpb0Rlc3RpbmF0aW9uTm9kZScsXG4gICAgICAgIGF1ZGlvTGlzdGVuZXI6ICdBdWRpb0xpc3RlbmVyJyxcbiAgICAgICAgYmlxdWFkRmlsdGVyOiAnQmlxdWFkRmlsdGVyTm9kZScsXG4gICAgICAgIGNoYW5uZWxNZXJnZXI6ICdDaGFubmVsTWVyZ2VyTm9kZScsXG4gICAgICAgIGNoYW5uZWxTcGxpdHRlcjogJ0NoYW5uZWxTcGxpdHRlck5vZGUnLFxuICAgICAgICBjb25zdGFudFNvdXJjZTogJ0NvbnN0YW50U291cmNlTm9kZScsXG4gICAgICAgIGNvbnZvbHZlcjogJ0NvbnZvbHZlck5vZGUnLFxuICAgICAgICBkZWxheTogJ0RlbGF5Tm9kZScsXG4gICAgICAgIGR5bmFtaWNzQ29tcHJlc3NvcjogJ0R5bmFtaWNzQ29tcHJlc3Nvck5vZGUnLFxuICAgICAgICBnYWluOiAnR2Fpbk5vZGUnLFxuICAgICAgICBJSVJGaWx0ZXI6ICdJSVJGaWx0ZXJOb2RlJyxcbiAgICAgICAgbWVkaWFFbGVtZW50QXVkaW9Tb3VyY2U6ICdNZWRpYUVsZW1lbnRBdWRpb1NvdXJjZU5vZGUnLFxuICAgICAgICBtZWRpYVN0cmVhbUF1ZGlvRGVzdGluYXRpb246ICdNZWRpYVN0cmVhbUF1ZGlvRGVzdGluYXRpb25Ob2RlJyxcbiAgICAgICAgbWVkaWFTdHJlYW1BdWRpb1NvdXJjZTogJ01lZGlhU3RyZWFtQXVkaW9Tb3VyY2VOb2RlJyxcbiAgICAgICAgb2ZmbGluZUF1ZGlvQ29udGV4dDogJ09mZmxpbmVBdWRpb0NvbnRleHQnLFxuICAgICAgICBvc2NpbGxhdG9yOiAnT3NjaWxsYXRvck5vZGUnLFxuICAgICAgICBwYW5uZXI6ICdQYW5uZXJOb2RlJyxcbiAgICAgICAgcGVyaW9kaWNXYXZlOiAnUGVyaW9kaWNXYXZlJyxcbiAgICAgICAgc3RlcmVvUGFubmVyOiAnU3RlcmVvUGFubmVyTm9kZScsXG4gICAgICAgIHdhdmVTaGFwZXI6ICdXYXZlU2hhcGVyTm9kZScsXG4gICAgICAgIGNvbXByZXNzb3I6ICdEeW5hbWljc0NvbXByZXNzb3JOb2RlJyxcbiAgICAgICAgZmlsdGVyOiAnQmlxdWFkRmlsdGVyTm9kZScsXG4gICAgICAgIGlpcjogJ0lJUkZpbHRlck5vZGUnLFxuICAgICAgICBtZXJnZXI6ICdDaGFubmVsTWVyZ2VyTm9kZScsXG4gICAgICAgIHNoYXBlcjogJ1dhdmVTaGFwZXJOb2RlJyxcbiAgICAgICAgc3BsaXR0ZXI6ICdDaGFubmVsU3BsaXR0ZXJOb2RlJ1xuICAgIH07XG59KCk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod2F2ZSkge1xuICAgIGZ1bmN0aW9uIFdhdmVDb2xsZWN0aW9uKHdhdmVOb2RlKSB7XG4gICAgICAgIHRoaXNbMF0gPSB3YXZlTm9kZTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgIH1cbiAgICBXYXZlQ29sbGVjdGlvbi5wcm90b3R5cGUgPSB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiBXYXZlQ29sbGVjdGlvbixcbiAgICAgICAgbGVuZ3RoOiAwLFxuICAgICAgICBjb250ZXh0OiB3YXZlLmNvbnRleHQsXG4gICAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzW3RoaXMubGVuZ3RoIC0gMV0uY29ubmVjdChzZWxlY3Rvcik7XG4gICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBsYXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcSgtMSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldDogZnVuY3Rpb24gKG51bSkge1xuICAgICAgICAgICAgaWYgKG51bSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsaWNlLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVtIDwgMCA/IHRoaXNbbnVtICsgdGhpcy5sZW5ndGhdIDogdGhpc1tudW1dO1xuICAgICAgICB9LFxuICAgICAgICBlcTogZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgIHZhciBsZW4gPSB0aGlzLmxlbmd0aCwgaiA9ICtpICsgKGkgPCAwID8gbGVuIDogMCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wdXNoU3RhY2soaiA+PSAwICYmIGogPCBsZW4gPyBbdGhpc1tqXV0gOiBbXSk7XG4gICAgICAgIH0sXG4gICAgICAgIHB1c2hTdGFjazogZnVuY3Rpb24gKGVsZW1zKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gd2F2ZS5tZXJnZSh0aGlzLmNvbnN0cnVjdG9yKCksIGVsZW1zKTtcbiAgICAgICAgICAgIHJldC5wcmV2T2JqZWN0ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0sXG4gICAgICAgIGVhY2g6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIHdhdmUuZWFjaCh0aGlzLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG4gICAgICAgIG1hcDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wdXNoU3RhY2sod2F2ZS5tYXAodGhpcywgZnVuY3Rpb24gKGVsZW0sIGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChlbGVtLCBpLCBlbGVtKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLmZvckVhY2goYXJnID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzW3RoaXMubGVuZ3RoXSA9IGFyZztcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgc3BsaWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5kZXhPZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5pbmRleE9mO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gV2F2ZUNvbGxlY3Rpb247XG59KHJlcXVpcmUoJy4uL2NvcmUnKSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod2F2ZSkge1xuICAgIGZ1bmN0aW9uIFdhdmVOb2RlKGlkLCBub2RlKSB7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5pbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy5vdXRwdXRzID0gW107XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbm5lY3QoaW5Ob2RlLCBvdXROb2RlKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgICAgICBpZiAoaW5Ob2RlLm5vZGUgJiYgb3V0Tm9kZS5ub2RlICYmIHdhdmUuaXNGdW5jdGlvbihpbk5vZGUubm9kZS5jb25uZWN0KSAmJiBvdXROb2RlLm5vZGUgaW5zdGFuY2VvZiBBdWRpb05vZGUpIHtcbiAgICAgICAgICAgIGluTm9kZS5ub2RlLmNvbm5lY3QuYXBwbHkoaW5Ob2RlLm5vZGUsIFtvdXROb2RlLm5vZGVdLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICBpbk5vZGUub3V0cHV0cy5wdXNoKG91dE5vZGUpO1xuICAgICAgICAgICAgb3V0Tm9kZS5pbnB1dHMucHVzaChpbk5vZGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXROb2RlO1xuICAgIH1cbiAgICBXYXZlTm9kZS5wcm90b3R5cGUgPSB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiBXYXZlTm9kZSxcbiAgICAgICAgY29udGV4dDogd2F2ZS5jb250ZXh0LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgZm9yIChsZXQgcGFyYW0gaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gcGFyYW1zW3BhcmFtXTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZVtwYXJhbV0gaW5zdGFuY2VvZiBBdWRpb1BhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVbcGFyYW1dLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZVtwYXJhbV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICAgICAgICAgICAgaWYgKHdhdmUudHlwZShzZWxlY3RvcikgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IgPSBuZXcgd2F2ZShzZWxlY3RvciwgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgZGlzY29ubmVjdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGRlc3RpbmF0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyB3YXZlLmZuLmluaXQodGhpcy5jb250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgICAgIGNvbm5lY3QodGhpcywgbm9kZSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgaWYgKHdhdmUuaXNGdW5jdGlvbihub2RlLnN0YXJ0KSkge1xuICAgICAgICAgICAgICAgIG5vZGUuc3RhcnQuYXBwbHkobm9kZSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gV2F2ZU5vZGU7XG59KHJlcXVpcmUoJy4uL2NvcmUnKSk7IiwiKGZ1bmN0aW9uICh3YXZlKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHdpbmRvdy53YXZlID0gd2luZG93LncgPSB3YXZlO1xufShyZXF1aXJlKCcuLi9jb3JlJykpKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh3YXZlKSB7XG4gICAgcmV0dXJuIHdhdmU7XG59KHJlcXVpcmUoJy4vY29yZScpLCByZXF1aXJlKCcuL2NvcmUvaW5pdCcpLCByZXF1aXJlKCcuL2NvcmUvbW9ubycpLCByZXF1aXJlKCcuL2V4cG9ydHMvZ2xvYmFsJykpOyJdfQ==
