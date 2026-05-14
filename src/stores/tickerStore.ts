import { create } from 'zustand';
import type { TickerData, ConnectionStatus, PriceDirection } from '@/shared/types';

interface TickerState {
  tickers: Record<string, TickerData>;
  directions: Record<string, PriceDirection>;
  connectionStatus: ConnectionStatus;
  retryCount: number;
  setTicker: (symbol: string, data: TickerData) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
}

export const useTickerStore = create<TickerState>((set) => ({
  tickers: {},
  directions: {},
  connectionStatus: 'disconnected',
  retryCount: 0,

  setTicker: (symbol, data) =>
    set((state) => {
      const prev = state.tickers[symbol];
      let direction: PriceDirection = 'neutral';
      if (prev) {
        if (data.price > prev.price) direction = 'up';
        else if (data.price < prev.price) direction = 'down';
      }
      return {
        tickers: { ...state.tickers, [symbol]: data },
        directions: { ...state.directions, [symbol]: direction },
      };
    }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  incrementRetry: () => set((state) => ({ retryCount: state.retryCount + 1 })),
  resetRetry: () => set({ retryCount: 0 }),
}));
