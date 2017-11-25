define(function() {
  "use strict";

  var classes = "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ");

  return classes.reduce(function (types, name) {
    types["[object " + name + "]"] = name.toLowerCase();
    return types;
  }, {});

});
