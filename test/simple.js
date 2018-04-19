'use strict';

const tm = require('..');

test('primitives', () => {
  expect(tm(0, 0));
  expect(tm(0, new Number(0)));
  expect(tm('a', 'a'));
  expect(tm(true, true));
  expect(tm(null, null));
  expect(tm(NaN, NaN));
  expect(!tm(0, -0));
  expect(!tm(1, '1'));
});

test('functions', () => {
  expect(tm([], Array.isArray));
  expect(tm('asdf', f => f.length === 4));
  expect(!tm('asdf', f => f.length === 5));
});

test('regex', () => {
  expect(tm(/a/ig, /a/gi));
  expect(!tm(/a/ig, /a/g));
  expect(!tm(/a/ig, /b/ig));
});

test('array', () => {
  expect(tm([], []));
  expect(tm([0, []], [0, []]));
  expect(tm([1], [1]));
  expect(tm([1,2], [1,,]));
  expect(tm([1,,], [1, void 0]));
  expect(!tm([1,2], [1]));
  expect(!tm([1], [1,2]));
});

test('object', () => {
  expect(tm({}, {}));
  expect(!tm(null, {}));
  expect(!tm({ a: 0 }, null));
  expect(tm({ a: { b: 0 }, c: 1 }, { a: { b: 0 }}));
  expect(!tm({ a: { b: 0 } }, { a: { b: 0 }, c: 1}));
});

test('combinations', () => {
  expect(tm({ a: [1, 2, [3, 4, 5]]}, { a: [1, 2, a => a.every(v => v < 6)]}));
  expect(!tm({ a: [1, 2, [3, 4, 6]]}, { a: [1, 2, a => a.every(v => v < 6)]}));
});

test('cycles', () => {
  let a = [];
  a[0] = a;

  let m = [];
  m[0] = m;

  expect(tm(a, m));
  expect(!tm(a, [[]]));
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

  expect(tm(matcher, treeOne));
  expect(!tm(matcher, treeOne));
})
