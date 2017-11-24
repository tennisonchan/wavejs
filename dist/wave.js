(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function () {
    wave.context = new (window.AudioContext || window.webkitAudioContext)();
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
                    jQuery.merge(ret, typeof arr === 'string' ? [arr] : arr);
                } else {
                    push.call(ret, arr);
                }
            }
            return ret;
        }
    });
    return wave;
}();

},{}],2:[function(require,module,exports){
"use strict";

module.exports = function () {
    return {
        nodeTable: {},
        set: function set(id, node) {
            this.nodeTable[id] = node;
        },
        get: function get(id) {
            return this.nodeTable[id] || null;
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

},{"../core":1,"./audio-node-module":2,"./var/node-map":5}],4:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    wave.extend({
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

},{}],6:[function(require,module,exports){
'use strict';

(function (wave) {
    'use strict';

    window.wave = window.w = wave;
})(require('../core'));

},{"../core":1}],7:[function(require,module,exports){
'use strict';

module.exports = function (wave) {
    return wave;
}(require('./core'), require('./core/init'), require('./core/mono'), require('./exports/global'));

},{"./core":1,"./core/init":3,"./core/mono":4,"./exports/global":6}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jb3JlLmpzIiwic3JjL2NvcmUvYXVkaW8tbm9kZS1tb2R1bGUuanMiLCJzcmMvY29yZS9pbml0LmpzIiwic3JjL2NvcmUvbW9uby5qcyIsInNyYy9jb3JlL3Zhci9ub2RlLW1hcC5qcyIsInNyYy9leHBvcnRzL2dsb2JhbC5qcyIsInNyYy93YXZlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBLE9BQU8sT0FBUCxHQUFpQixZQUFZO0FBQ3pCLFNBQUssT0FBTCxHQUFlLEtBQUssT0FBTyxZQUFQLElBQXVCLE9BQU8sa0JBQW5DLEdBQWY7QUFDQSxhQUFTLElBQVQsQ0FBYyxRQUFkLEVBQXdCLE9BQXhCLEVBQWlDO0FBQzdCLGVBQU8sSUFBSSxLQUFLLEVBQUwsQ0FBUSxJQUFaLENBQWlCLFFBQWpCLEVBQTJCLE9BQTNCLENBQVA7QUFDSDtBQUNELFNBQUssRUFBTCxHQUFVLEtBQUssU0FBTCxHQUFpQjtBQUN2QixxQkFBYSxJQURVO0FBRXZCLGdCQUFRLENBRmU7QUFHdkIsaUJBQVMsS0FBSyxPQUhTO0FBSXZCLGVBQU8sZUFBVSxJQUFWLEVBQWdCO0FBQ25CLGlCQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksS0FBWixDQUFrQixJQUFsQjtBQUNBLG1CQUFPLElBQVA7QUFDSCxTQVBzQjtBQVF2QixpQkFBUyxpQkFBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCO0FBQ2xDLGdCQUFJLFdBQVcsS0FBSyxJQUFMLEVBQWY7QUFDQSxnQkFBSSxJQUFKO0FBQ0EsZ0JBQUksUUFBSixFQUFjO0FBQ1YsdUJBQU8sS0FBSyxXQUFMLENBQWlCLFFBQWpCLEVBQTJCLFdBQVcsRUFBdEMsQ0FBUDtBQUNBLHlCQUFTLEdBQVQsQ0FBYSxDQUFiLEVBQWdCLE9BQWhCLENBQXdC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QkFBUSxrQkExQkw7QUEyQkgsYUFBSyxlQTNCRjtBQTRCSCxnQkFBUSxtQkE1Qkw7QUE2QkgsZ0JBQVEsZ0JBN0JMO0FBOEJILGtCQUFVO0FBOUJQLEtBQVA7QUFnQ0gsQ0FqQ2dCLEVBQWpCOzs7OztBQ0FDLFdBQVUsSUFBVixFQUFnQjtBQUNiOztBQUNBLFdBQU8sSUFBUCxHQUFjLE9BQU8sQ0FBUCxHQUFXLElBQXpCO0FBQ0gsQ0FIQSxFQUdDLFFBQVEsU0FBUixDQUhELENBQUQ7Ozs7O0FDQUEsT0FBTyxPQUFQLEdBQWlCLFVBQVUsSUFBVixFQUFnQjtBQUM3QixXQUFPLElBQVA7QUFDSCxDQUZnQixDQUVmLFFBQVEsUUFBUixDQUZlLEVBRUksUUFBUSxhQUFSLENBRkosRUFFNEIsUUFBUSxhQUFSLENBRjVCLEVBRW9ELFFBQVEsa0JBQVIsQ0FGcEQsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgd2F2ZS5jb250ZXh0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgZnVuY3Rpb24gd2F2ZShzZWxlY3RvciwgY29udGV4dCkge1xuICAgICAgICByZXR1cm4gbmV3IHdhdmUuZm4uaW5pdChzZWxlY3RvciwgY29udGV4dCk7XG4gICAgfVxuICAgIHdhdmUuZm4gPSB3YXZlLnByb3RvdHlwZSA9IHtcbiAgICAgICAgY29uc3RydWN0b3I6IHdhdmUsXG4gICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgY29udGV4dDogd2F2ZS5jb250ZXh0LFxuICAgICAgICBzdGFydDogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0KDApLnN0YXJ0KHRpbWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbm5lY3Q6IGZ1bmN0aW9uIChzZWxlY3RvciwgY29udGV4dCkge1xuICAgICAgICAgICAgdmFyIGxhc3ROb2RlID0gdGhpcy5sYXN0KCk7XG4gICAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICAgIGlmIChsYXN0Tm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSB0aGlzLmNvbnN0cnVjdG9yKHNlbGVjdG9yLCBjb250ZXh0IHx8IHt9KTtcbiAgICAgICAgICAgICAgICBsYXN0Tm9kZS5nZXQoMCkuY29ubmVjdChub2RlLmdldCgwKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoKG5vZGUuZ2V0KDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBkaXNjb25uZWN0OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2Yobm9kZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5kaXNjb25uZWN0LmFwcGx5KG5vZGUsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBkZXN0aW5hdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxhc3ROb2RlID0gdGhpcy5sYXN0KCk7XG4gICAgICAgICAgICBpZiAobGFzdE5vZGUpIHtcbiAgICAgICAgICAgICAgICBsYXN0Tm9kZS5nZXQoMCkuY29ubmVjdCh0aGlzLmNvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdObyBBdWRpb05vZGUgY29ubmVjdCB0byBvdXRwdXQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgYXR0cjogZnVuY3Rpb24gKG5vZGUsIGF0dHJzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwYXJhbSBpbiBhdHRycykge1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGF0dHJzW3BhcmFtXTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZVtwYXJhbV0gaW5zdGFuY2VvZiBBdWRpb1BhcmFtKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVbcGFyYW1dLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZVtwYXJhbV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGxhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVxKC0xKTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgICAgICBpZiAobnVtID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xpY2UuY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudW0gPCAwID8gdGhpc1tudW0gKyB0aGlzLmxlbmd0aF0gOiB0aGlzW251bV07XG4gICAgICAgIH0sXG4gICAgICAgIGVxOiBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoLCBqID0gK2kgKyAoaSA8IDAgPyBsZW4gOiAwKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnB1c2hTdGFjayhqID49IDAgJiYgaiA8IGxlbiA/IFt0aGlzW2pdXSA6IFtdKTtcbiAgICAgICAgfSxcbiAgICAgICAgcHVzaFN0YWNrOiBmdW5jdGlvbiAoZWxlbXMpIHtcbiAgICAgICAgICAgIHZhciByZXQgPSB3YXZlLm1lcmdlKHRoaXMuY29uc3RydWN0b3IoKSwgZWxlbXMpO1xuICAgICAgICAgICAgcmV0LnByZXZPYmplY3QgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSxcbiAgICAgICAgZWFjaDogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gd2F2ZS5lYWNoKHRoaXMsIGNhbGxiYWNrKTtcbiAgICAgICAgfSxcbiAgICAgICAgbWFwOiBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnB1c2hTdGFjayh3YXZlLm1hcCh0aGlzLCBmdW5jdGlvbiAoZWxlbSwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGVsZW0sIGksIGVsZW0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9LFxuICAgICAgICBwdXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykuZm9yRWFjaChhcmcgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXNbdGhpcy5sZW5ndGhdID0gYXJnO1xuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBzcGxpY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc3BsaWNlO1xuICAgICAgICB9LFxuICAgICAgICBpbmRleE9mOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmluZGV4T2Y7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHdhdmUuZXh0ZW5kID0gd2F2ZS5mbi5leHRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvcHRpb25zLCBuYW1lLCBzcmMsIGNvcHksIGNvcHlJc0FycmF5LCBjbG9uZSwgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LCBpID0gMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwgZGVlcCA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBkZWVwID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldIHx8IHt9O1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JyAmJiAhd2F2ZS5pc0Z1bmN0aW9uKHRhcmdldCkpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKChvcHRpb25zID0gYXJndW1lbnRzW2ldKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yIChuYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgc3JjID0gdGFyZ2V0W25hbWVdO1xuICAgICAgICAgICAgICAgICAgICBjb3B5ID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZXAgJiYgY29weSAmJiAod2F2ZS5pc1BsYWluT2JqZWN0KGNvcHkpIHx8IChjb3B5SXNBcnJheSA9IEFycmF5LmlzQXJyYXkoY29weSkpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvcHlJc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29weUlzQXJyYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiBBcnJheS5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgd2F2ZS5pc1BsYWluT2JqZWN0KHNyYykgPyBzcmMgOiB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IHdhdmUuZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IGNvcHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuICAgIHdhdmUuZXh0ZW5kKHtcbiAgICAgICAgbWVyZ2U6IGZ1bmN0aW9uIChmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICB2YXIgbGVuID0gK3NlY29uZC5sZW5ndGgsIGogPSAwLCBpID0gZmlyc3QubGVuZ3RoO1xuICAgICAgICAgICAgZm9yICg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICAgIGZpcnN0W2krK10gPSBzZWNvbmRbal07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaXJzdC5sZW5ndGggPSBpO1xuICAgICAgICAgICAgcmV0dXJuIGZpcnN0O1xuICAgICAgICB9LFxuICAgICAgICBtYWtlQXJyYXk6IGZ1bmN0aW9uIChhcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuICAgICAgICAgICAgaWYgKGFyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlMaWtlKE9iamVjdChhcnIpKSkge1xuICAgICAgICAgICAgICAgICAgICBqUXVlcnkubWVyZ2UocmV0LCB0eXBlb2YgYXJyID09PSAnc3RyaW5nJyA/IFthcnJdIDogYXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwdXNoLmNhbGwocmV0LCBhcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gd2F2ZTtcbn0oKTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBub2RlVGFibGU6IHt9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChpZCwgbm9kZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlVGFibGVbaWRdID0gbm9kZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGVUYWJsZVtpZF0gfHwgbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG59KCk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod2F2ZSwgbm9kZU1hcCwgQU5NKSB7XG4gICAgdmFyIHJxdWlja0V4cHIgPSAvXig/OlxccyooW1xcd1xcV10rKSMoW1xcdy1dKykpJC87XG4gICAgdmFyIGluaXQgPSB3YXZlLmZuLmluaXQgPSBmdW5jdGlvbiAoc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICAgICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1hdGNoO1xuICAgICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yWzBdID09PSAnIycpIHtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IFtcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Iuc2xpY2UoMSlcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHJxdWlja0V4cHIuZXhlYyhzZWxlY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoICYmIChtYXRjaFsxXSB8fCAhY29udGV4dCkpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaFsxXSkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlTmFtZSA9IG5vZGVNYXBbbWF0Y2hbMV1dO1xuICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyB3aW5kb3dbbm9kZU5hbWVdKHRoaXMuY29udGV4dCwgY29udGV4dCB8fCB7fSk7XG4gICAgICAgICAgICAgICAgICAgIEFOTS5zZXQobWF0Y2hbMl0sIG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzWzBdID0gbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBub2RlID0gQU5NLmdldChtYXRjaFsyXSk7XG4gICAgICAgICAgICAgICAgdGhpc1swXSA9IG5vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGggPSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdG9yIGluc3RhbmNlb2YgQXVkaW9Ob2RlKSB7XG4gICAgICAgICAgICB0aGlzWzBdID0gc2VsZWN0b3I7XG4gICAgICAgICAgICB0aGlzLmxlbmd0aCA9IDE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd2F2ZS5tYWtlQXJyYXkoc2VsZWN0b3IsIHRoaXMpO1xuICAgIH07XG4gICAgaW5pdC5wcm90b3R5cGUgPSB3YXZlLmZuO1xuICAgIHJldHVybiBpbml0O1xufShyZXF1aXJlKCcuLi9jb3JlJyksIHJlcXVpcmUoJy4vdmFyL25vZGUtbWFwJyksIHJlcXVpcmUoJy4vYXVkaW8tbm9kZS1tb2R1bGUnKSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod2F2ZSkge1xuICAgIHdhdmUuZXh0ZW5kKHtcbiAgICAgICAgY29udmVydFRvTW9ubzogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgc3BsaXR0ZXIgPSB0aGlzLmNvbnRleHQuY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDIpO1xuICAgICAgICAgICAgdmFyIG1lcmdlciA9IHRoaXMuY29udGV4dC5jcmVhdGVDaGFubmVsTWVyZ2VyKDIpO1xuICAgICAgICAgICAgaW5wdXQuY29ubmVjdChzcGxpdHRlcik7XG4gICAgICAgICAgICBzcGxpdHRlci5jb25uZWN0KG1lcmdlciwgMCwgMCk7XG4gICAgICAgICAgICBzcGxpdHRlci5jb25uZWN0KG1lcmdlciwgMCwgMSk7XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VyO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHdhdmU7XG59KHJlcXVpcmUoJy4uL2NvcmUnKSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYW5hbHlzZXI6ICdBbmFseXNlck5vZGUnLFxuICAgICAgICBhdWRpb0J1ZmZlcjogJ0F1ZGlvQnVmZmVyJyxcbiAgICAgICAgYXVkaW9CdWZmZXJTb3VyY2U6ICdBdWRpb0J1ZmZlclNvdXJjZU5vZGUnLFxuICAgICAgICBhdWRpb0NvbnRleHQ6ICdBdWRpb0NvbnRleHQnLFxuICAgICAgICBhdWRpb0Rlc3RpbmF0aW9uOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLFxuICAgICAgICBhdWRpb0xpc3RlbmVyOiAnQXVkaW9MaXN0ZW5lcicsXG4gICAgICAgIGJpcXVhZEZpbHRlcjogJ0JpcXVhZEZpbHRlck5vZGUnLFxuICAgICAgICBjaGFubmVsTWVyZ2VyOiAnQ2hhbm5lbE1lcmdlck5vZGUnLFxuICAgICAgICBjaGFubmVsU3BsaXR0ZXI6ICdDaGFubmVsU3BsaXR0ZXJOb2RlJyxcbiAgICAgICAgY29uc3RhbnRTb3VyY2U6ICdDb25zdGFudFNvdXJjZU5vZGUnLFxuICAgICAgICBjb252b2x2ZXI6ICdDb252b2x2ZXJOb2RlJyxcbiAgICAgICAgZGVsYXk6ICdEZWxheU5vZGUnLFxuICAgICAgICBkeW5hbWljc0NvbXByZXNzb3I6ICdEeW5hbWljc0NvbXByZXNzb3JOb2RlJyxcbiAgICAgICAgZ2FpbjogJ0dhaW5Ob2RlJyxcbiAgICAgICAgSUlSRmlsdGVyOiAnSUlSRmlsdGVyTm9kZScsXG4gICAgICAgIG1lZGlhRWxlbWVudEF1ZGlvU291cmNlOiAnTWVkaWFFbGVtZW50QXVkaW9Tb3VyY2VOb2RlJyxcbiAgICAgICAgbWVkaWFTdHJlYW1BdWRpb0Rlc3RpbmF0aW9uOiAnTWVkaWFTdHJlYW1BdWRpb0Rlc3RpbmF0aW9uTm9kZScsXG4gICAgICAgIG1lZGlhU3RyZWFtQXVkaW9Tb3VyY2U6ICdNZWRpYVN0cmVhbUF1ZGlvU291cmNlTm9kZScsXG4gICAgICAgIG9mZmxpbmVBdWRpb0NvbnRleHQ6ICdPZmZsaW5lQXVkaW9Db250ZXh0JyxcbiAgICAgICAgb3NjaWxsYXRvcjogJ09zY2lsbGF0b3JOb2RlJyxcbiAgICAgICAgcGFubmVyOiAnUGFubmVyTm9kZScsXG4gICAgICAgIHBlcmlvZGljV2F2ZTogJ1BlcmlvZGljV2F2ZScsXG4gICAgICAgIHN0ZXJlb1Bhbm5lcjogJ1N0ZXJlb1Bhbm5lck5vZGUnLFxuICAgICAgICB3YXZlU2hhcGVyOiAnV2F2ZVNoYXBlck5vZGUnLFxuICAgICAgICBjb21wcmVzc29yOiAnRHluYW1pY3NDb21wcmVzc29yTm9kZScsXG4gICAgICAgIGZpbHRlcjogJ0JpcXVhZEZpbHRlck5vZGUnLFxuICAgICAgICBpaXI6ICdJSVJGaWx0ZXJOb2RlJyxcbiAgICAgICAgbWVyZ2VyOiAnQ2hhbm5lbE1lcmdlck5vZGUnLFxuICAgICAgICBzaGFwZXI6ICdXYXZlU2hhcGVyTm9kZScsXG4gICAgICAgIHNwbGl0dGVyOiAnQ2hhbm5lbFNwbGl0dGVyTm9kZSdcbiAgICB9O1xufSgpOyIsIihmdW5jdGlvbiAod2F2ZSkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB3aW5kb3cud2F2ZSA9IHdpbmRvdy53ID0gd2F2ZTtcbn0ocmVxdWlyZSgnLi4vY29yZScpKSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAod2F2ZSkge1xuICAgIHJldHVybiB3YXZlO1xufShyZXF1aXJlKCcuL2NvcmUnKSwgcmVxdWlyZSgnLi9jb3JlL2luaXQnKSwgcmVxdWlyZSgnLi9jb3JlL21vbm8nKSwgcmVxdWlyZSgnLi9leHBvcnRzL2dsb2JhbCcpKTsiXX0=
