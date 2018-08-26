# `tree-matcher`

Yet another (very small) npm package for testing structural equality.

Intended mainly for cases when you have the "skeleton" of a tree and want to check that some object conforms to that skeleton, possibly with additional parts. For example, it works well for matching ASTs.


## Usage

This module exports a single function which takes a matcher and a value, and returns true if the matcher matches the value according to the rules below.


## Examples

```js
const tm = require('tree-matcher');

const treeOne = {
  type: 'BinaryExpression',
  left: {
    type: 'LiteralNumericExpression',
    value: 0,
  },
  right: {
    type: 'LiteralNumericExpression',
    value: 1,
  },
};

const treeTwo = {
  type: 'BinaryExpression',
  left: {
    type: 'LiteralNumericExpression',
    value: 0,
  },
  right: {
    type: 'LiteralNumericExpression',
    value: 2,
  },
};

const matcher = {
  type: 'BinaryExpression',
  left: node => node.type !== 'LiteralStringExpression',
  right: {
    value: 1,
  },
};

tm(matcher, treeOne); // true
tm(matcher, treeTwo); // false

```


## Matching rules

A matcher _matches_ a value as follows:

### Primitives
A primitive `p` matches a value `x` if `Object.is(p, x)` is true. For example, `null` matches `null`, `NaN` matches `NaN`, `1` does not match `'1'`, and `0` does not match `-0`.

### Functions
A function `f` matches a value `x` if `f(x)` is truthy. For example, `Array.isArray` matches `[]`.

### RegExps
A regex `r` matches a value `x` if `x` is a regex and `x` has the same `.source` and `.flags` as `r`.

### Arrays
An array `a` matches a value `x` if `x` is an array, the two are of the same length, and for every non-hole index `i` in `a`, `a[i]` matches `x[i]`. Holes in the matcher array match anything; holes in `x` are matched by `undefined`. For example, `[1]` matches `[1]`, `[1,,]` matches `[1,2]`, `[1,void 0]` matches `[1,,]`, `[1]` does not match `[1, 2]`, and `[1, 2]` does not match `[1]`.

### Objects
Any other object `o` matches a value `x` if `x` is an object and for every enumerable own key `k` in `o`, `o[k]` matches `x[k]`. For example, `{ a: { b: 0 }, c: 1 }` matches `{ a: { b: 0 } }`, and `{ a: { b: 0 } }` does not match `{ a: { b: 0 }, c: 1 }`.
