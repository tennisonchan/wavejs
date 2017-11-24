define([], function() {

  wave.context = new (window.AudioContext || window.webkitAudioContext)();

  function wave (selector, context) {
    return new wave.fn.init(selector, context);
  }

  wave.fn = wave.prototype = {
    constructor: wave,
    length: 0,

    context: wave.context,

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

  wave.extend = wave.fn.extend = function () {
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
    if (typeof target !== "object" && !wave.isFunction(target)) {
      target = {};
    }

    // Extend wave itself if only one argument is passed
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
          if ( deep && copy && ( wave.isPlainObject( copy ) ||
            ( copyIsArray = Array.isArray( copy ) ) ) ) {

            if ( copyIsArray ) {
              copyIsArray = false;
              clone = src && Array.isArray( src ) ? src : [];

            } else {
              clone = src && wave.isPlainObject( src ) ? src : {};
            }

            // Never move original objects, clone them
            target[ name ] = wave.extend( deep, clone, copy );

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

  wave.extend({
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

  return wave;
});