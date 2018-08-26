'use strict';

const assert = require('assert');

const tm = require('..');

test('primitives', () => {
  assert(tm(0, 0));
  assert(!tm(0, new Number(0)));
  assert(tm('', ''));
  assert(tm('a', 'a'));
  assert(!tm('a', 'A'));
  assert(tm(true, true));
  assert(tm(null, null));
  assert(tm(NaN, NaN));
  assert(!tm(0, -0));
  assert(!tm(1, '1'));
});

test('functions', () => {
  assert(tm(Array.isArray, []));
  assert(tm(f => f.length === 4, 'asdf'));
  assert(!tm(f => f.length === 5, 'asdf'));
});

test('regex', () => {
  assert(tm(/a/ig, /a/gi));
  assert(!tm(/a/ig, /a/g));
  assert(!tm(/a/ig, /b/ig));
});

test('array', () => {
  assert(tm([], []));
  assert(tm([0, []], [0, []]));
  assert(tm([1], [1]));
  assert(tm([1,,], [1,2]));
  assert(tm([1,void 0], [1,,]));
  assert(!tm([1], [1,2]));
  assert(!tm([1,2], [1]));
});

test('object', () => {
  assert(tm({}, {}));
  assert(!tm({}, null));
  assert(!tm({ a: 0 }, null));
  assert(tm({ a: 0 }, { a: 0, b: 1 }))
  assert(!tm({ a: 0, b: 1 }, { a: 0 }))
  assert(tm({ a: { b: 0 } }, { a: { b: 0 }, c: 1 }));
  assert(!tm({ a: { b: 0 }, c: 1 }, { a: { b: 0 } }));
});

test('combinations', () => {
  assert(tm({ a: [1, 2, a => a.every(v => v < 6)]}, { a: [1, 2, [3, 4, 5]]}));
  assert(!tm({ a: [1, 2, a => a.every(v => v < 6)]}, { a: [1, 2, [3, 4, 6]]}));
});

test('bigint', () => {
  if (typeof BigInt !== 'function') {
    return;
  }
  assert(tm(BigInt('0'), BigInt('0')));
  assert(!tm(BigInt('0'), BigInt('1')));
  assert(!tm(BigInt('0'), 0));
  assert(!tm(0, BigInt('0')));
});

test('cycles', () => {
  let m = [];
  m[0] = m;

  let x = [];
  x[0] = x;

  assert(tm(m, x));
  assert(!tm(m, [[]]));
});

test('example', () => {
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

  assert(tm(matcher, treeOne));
  assert(!tm(matcher, treeTwo));
})
