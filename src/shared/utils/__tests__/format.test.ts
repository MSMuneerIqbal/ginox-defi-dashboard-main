import { describe, it, expect } from 'vitest';
import {
  truncateAddress,
  formatCurrency,
  formatPrice,
  formatPercent,
  formatVolume,
  formatBalance,
  classNames,
} from '../format';

describe('truncateAddress', () => {
  it('truncates a long address with default params', () => {
    const result = truncateAddress('0x1234567890abcdef1234567890abcdef12345678');
    expect(result).toBe('0x1234...5678');
  });

  it('returns the address unchanged when shorter than start+end', () => {
    expect(truncateAddress('0xshort')).toBe('0xshort');
  });
});

describe('formatCurrency', () => {
  it('formats billions', () => {
    expect(formatCurrency(5_000_000_000)).toBe('$5.00B');
  });

  it('formats millions', () => {
    expect(formatCurrency(2_500_000)).toBe('$2.50M');
  });

  it('formats thousands', () => {
    expect(formatCurrency(5_000)).toBe('$5.00K');
  });

  it('formats small values with decimals', () => {
    expect(formatCurrency(42.567, 2)).toBe('$42.57');
  });
});

describe('formatPrice', () => {
  it('formats large prices with locale', () => {
    const result = formatPrice(65000.1234);
    expect(result).toBe('65,000.12');
  });

  it('formats mid-range prices', () => {
    expect(formatPrice(3.5)).toBe('3.50');
  });

  it('formats small prices with more decimals', () => {
    expect(formatPrice(0.045)).toBe('0.0450');
  });

  it('formats tiny prices with 6 decimals', () => {
    expect(formatPrice(0.00001234)).toBe('0.000012');
  });
});

describe('formatPercent', () => {
  it('adds + sign for positive values', () => {
    expect(formatPercent(12.345)).toBe('+12.35%');
  });

  it('shows - sign for negative values', () => {
    expect(formatPercent(-5.678)).toBe('-5.68%');
  });
});

describe('formatVolume', () => {
  it('formats billions', () => {
    expect(formatVolume(1_200_000_000)).toBe('1.20B');
  });

  it('formats millions', () => {
    expect(formatVolume(500_000_000)).toBe('500.00M');
  });

  it('formats thousands', () => {
    expect(formatVolume(75_000)).toBe('75.00K');
  });

  it('formats small numbers', () => {
    expect(formatVolume(123.456)).toBe('123.46');
  });
});

describe('formatBalance', () => {
  it('formats a token balance from bigint', () => {
    // 1.5 ETH (18 decimals)
    const balance = BigInt('1500000000000000000');
    expect(formatBalance(balance, 18, 4)).toBe('1.5000');
  });

  it('handles zero balance', () => {
    expect(formatBalance(BigInt(0), 6, 2)).toBe('0.00');
  });
});

describe('classNames', () => {
  it('joins truthy values', () => {
    expect(classNames('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(classNames('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });
});
