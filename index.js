'use strict';

module.exports = function treeMatcher(matcher, val) {
  return treeMatcherInternal(matcher, val, new WeakMap);
};


// cache is of type `matcher object -> value -> boolean`
// and is used to handle cycles
function treeMatcherInternal(matcher, val, cache) {
  if (typeof matcher === 'string' || typeof matcher === 'number' || typeof matcher === 'boolean' || typeof matcher === 'undefined' || typeof matcher === 'symbol' || typeof matcher === 'bigint' || matcher === null) {
    return Object.is(val, matcher);
  }
  if (typeof matcher === 'function') {
    return matcher(val);
  }
  if (matcher instanceof RegExp) { // todo switch to https://www.npmjs.com/package/is-regex
    return val instanceof RegExp && val.source === matcher.source && val.flags === matcher.flags;
  }
  if (typeof matcher !== 'object') {
    return false; // future-proof against new types
  }
  if (typeof val !== 'object' || val === null) {
    return false;
  }

  if (!cache.has(matcher)) {
    cache.set(matcher, new WeakMap);
  }
  const map = cache.get(matcher);
  if (map.has(val)) {
    return map.get(val);
  }
  map.set(val, true);
  const res = Array.isArray(matcher)
    ? Array.isArray(val) && val.length === matcher.length && matcher.every((v, i) => treeMatcherInternal(v, val[i], cache))
    : Object.entries(matcher).every(([k, v]) => treeMatcherInternal(v, val[k], cache));
  map.set(val, res);

  return res;
};
