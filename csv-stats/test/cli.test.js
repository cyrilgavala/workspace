const test = require('node:test');
const assert = require('node:assert');
const { parseCsv, stats } = require('../cli');

test('parseCsv splits headers and rows, honoring quoted commas', () => {
  assert.deepStrictEqual(parseCsv('a,b\n1,"x,y"\n'), [['a', 'b'], ['1', 'x,y']]);
});

test('parseCsv drops blank lines', () => {
  assert.deepStrictEqual(parseCsv('a\n\n1\n'), [['a'], ['1']]);
});

test('stats returns count/min/max/average', () => {
  assert.deepStrictEqual(stats([12.5, 3.25, 8, 4.75]), {
    count: 4,
    min: 3.25,
    max: 12.5,
    average: 7.13,
  });
});
