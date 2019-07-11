// import { sum } from "./sum";
// const sum = require('./sum');
// import { add } from './sum';
// const hello = require('./sum');

const add = jest.fn((x, y) => x+y);

test('add', () => {
  expect(add(1, 4)).toBe(5);
  expect(add(1, 2)).toBe(3);
  expect(add).toHaveBeenCalledTimes(2);
});

// test('hello', () => {
//   expect("hello").toMatch(/hello/);
// });

// test('add', () => {
//   expect(sum(1, 2)).toBe(3);
// });