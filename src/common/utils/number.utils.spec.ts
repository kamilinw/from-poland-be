import {
  toIntegerFormat,
  toFixedPoint,
  EXCHANGE_RATE_MULTIPLIER,
} from './number.utils';

describe('Number Utils', () => {
  describe('toIntegerFormat', () => {
    it('should normalize amount with default multiplier', () => {
      expect(toIntegerFormat(123.45)).toBe(12345);
      expect(toIntegerFormat(0.01)).toBe(1);
      expect(toIntegerFormat(1000000)).toBe(100000000);
    });

    it('should normalize amount with custom multiplier', () => {
      expect(toIntegerFormat(123.4567, EXCHANGE_RATE_MULTIPLIER)).toBe(1234567);
      expect(toIntegerFormat(0.0001, EXCHANGE_RATE_MULTIPLIER)).toBe(1);
    });

    it('should round to nearest integer', () => {
      expect(toIntegerFormat(123.456)).toBe(12346);
      expect(toIntegerFormat(123.454)).toBe(12345);
    });

    it('should handle zero', () => {
      expect(toIntegerFormat(0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(toIntegerFormat(-123.45)).toBe(-12345);
      expect(toIntegerFormat(-0.01)).toBe(-1);
    });

    it('should throw error for invalid input', () => {
      expect(() => toIntegerFormat(NaN)).toThrow('Invalid amount: NaN');
      expect(() => toIntegerFormat('123' as unknown as number)).toThrow(
        'Invalid amount: 123',
      );
    });
  });

  describe('toFixedPoint', () => {
    it('should convert integer to fixed point with default decimal places', () => {
      expect(toFixedPoint(12345)).toBe(123.45);
      expect(toFixedPoint(1)).toBe(0.01);
      expect(toFixedPoint(100000000)).toBe(1000000);
    });

    it('should convert integer to fixed point with custom decimal places', () => {
      expect(toFixedPoint(1234567, 4)).toBe(123.4567);
      expect(toFixedPoint(1, 4)).toBe(0.0001);
    });

    it('should round to specified decimal places', () => {
      expect(toFixedPoint(12346, 2)).toBe(123.46);
      expect(toFixedPoint(12345, 2)).toBe(123.45);
    });

    it('should handle zero', () => {
      expect(toFixedPoint(0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(toFixedPoint(-12345)).toBe(-123.45);
      expect(toFixedPoint(-1)).toBe(-0.01);
    });

    it('should throw error for invalid input', () => {
      expect(() => toFixedPoint(NaN)).toThrow('Invalid amount: NaN');
      expect(() => toFixedPoint('123' as unknown as number)).toThrow(
        'Invalid amount: 123',
      );
    });
  });
});
