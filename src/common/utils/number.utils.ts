import Decimal from 'decimal.js';

export const AMOUNT_MULTIPLIER = 100; // 2 decimal places
export const EXCHANGE_RATE_MULTIPLIER = 10000; // 4 decimal places

export function toIntegerFormat(
  amount: number,
  multiplier = AMOUNT_MULTIPLIER,
): number {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  return new Decimal(amount)
    .times(multiplier)
    .toDecimalPlaces(0, Decimal.ROUND_HALF_UP)
    .toNumber();
}

export function toFixedPoint(amount: number, decimalPlaces = 2): number {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  const multiplier = 10 ** decimalPlaces;

  return new Decimal(amount)
    .div(multiplier)
    .toDecimalPlaces(decimalPlaces, Decimal.ROUND_HALF_UP)
    .toNumber();
}
