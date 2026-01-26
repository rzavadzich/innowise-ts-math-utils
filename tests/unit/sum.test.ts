import { expect, test, describe } from 'vitest';
import { sum } from '../../src/sum';

describe('sum function', () => {
  test('adds positive integers correctly', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(5, 7)).toBe(12);
    expect(sum(0, 5)).toBe(5);
  });

  test('handles zero and negative numbers', () => {
    expect(sum(0, 0)).toBe(0);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(-5, 3)).toBe(-2);
    expect(sum(0, -7)).toBe(-7);
  });

  test('handles floating point numbers', () => {
    expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
    expect(sum(-0.1, 0.3)).toBeCloseTo(0.2);
  });
});
