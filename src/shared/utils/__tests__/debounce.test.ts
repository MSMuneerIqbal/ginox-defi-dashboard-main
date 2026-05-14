import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays the function call by the specified ms', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('a');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('only calls once for rapid invocations', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced('a');
    vi.advanceTimersByTime(100);
    debounced('b');
    vi.advanceTimersByTime(100);
    debounced('c');
    vi.advanceTimersByTime(100);

    // Still not called — debounce timer keeps resetting
    expect(fn).not.toHaveBeenCalled();

    // Let the final timer expire
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledWith('c');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
