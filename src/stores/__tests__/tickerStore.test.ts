import { describe, it, expect, beforeEach } from 'vitest';
import { useTickerStore } from '../tickerStore';
import type { TickerData } from '@/shared/types';

function getState() {
  return useTickerStore.getState();
}

function makeTicker(overrides: Partial<TickerData> = {}): TickerData {
  return {
    symbol: 'BTC',
    price: 50000,
    change24h: 2.5,
    changePercent24h: 2.5,
    volume24h: 1_000_000_000,
    high24h: 51000,
    low24h: 49000,
    prevPrice: 48780,
    ...overrides,
  };
}

describe('useTickerStore', () => {
  beforeEach(() => {
    useTickerStore.setState({
      tickers: {},
      directions: {},
      connectionStatus: 'disconnected',
      retryCount: 0,
    });
  });

  it('starts with disconnected status and empty tickers', () => {
    const state = getState();
    expect(state.connectionStatus).toBe('disconnected');
    expect(state.tickers).toEqual({});
    expect(state.retryCount).toBe(0);
  });

  it('stores ticker data and detects upward price direction', () => {
    getState().setTicker('btcusdt', makeTicker({ symbol: 'BTC', price: 50000 }));

    let state = getState();
    expect(state.tickers['btcusdt']!.price).toBe(50000);
    expect(state.directions['btcusdt']).toBe('neutral');

    getState().setTicker('btcusdt', makeTicker({ symbol: 'BTC', price: 51000 }));

    state = getState();
    expect(state.tickers['btcusdt']!.price).toBe(51000);
    expect(state.directions['btcusdt']).toBe('up');
  });

  it('detects downward price direction', () => {
    getState().setTicker('ethusdt', makeTicker({ symbol: 'ETH', price: 3000 }));
    getState().setTicker('ethusdt', makeTicker({ symbol: 'ETH', price: 2900 }));

    expect(getState().directions['ethusdt']).toBe('down');
  });

  it('manages connection status', () => {
    getState().setConnectionStatus('connected');
    expect(getState().connectionStatus).toBe('connected');

    getState().setConnectionStatus('reconnecting');
    expect(getState().connectionStatus).toBe('reconnecting');
  });

  it('tracks retry count', () => {
    getState().incrementRetry();
    getState().incrementRetry();
    expect(getState().retryCount).toBe(2);

    getState().resetRetry();
    expect(getState().retryCount).toBe(0);
  });
});
