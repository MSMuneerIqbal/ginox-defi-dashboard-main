import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PortfolioToken } from '@/shared/types';

interface PortfolioState {
  manualTokens: PortfolioToken[];
  detectedTokens: PortfolioToken[];
  addManualToken: (token: PortfolioToken) => void;
  removeManualToken: (address: string) => void;
  setDetectedTokens: (tokens: PortfolioToken[]) => void;
  updateTokenPrice: (address: string, price: number) => void;
  clearDetectedTokens: () => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      manualTokens: [],
      detectedTokens: [],

      addManualToken: (token) =>
        set((state) => {
          const exists = state.manualTokens.some(
            (t) => t.address.toLowerCase() === token.address.toLowerCase(),
          );
          if (exists) return state;
          return { manualTokens: [...state.manualTokens, token] };
        }),

      removeManualToken: (address) =>
        set((state) => ({
          manualTokens: state.manualTokens.filter(
            (t) => t.address.toLowerCase() !== address.toLowerCase(),
          ),
        })),

      setDetectedTokens: (tokens) => set({ detectedTokens: tokens }),

      updateTokenPrice: (address, price) =>
        set((state) => ({
          detectedTokens: state.detectedTokens.map((t) =>
            t.address.toLowerCase() === address.toLowerCase() ? { ...t, currentPrice: price } : t,
          ),
          manualTokens: state.manualTokens.map((t) =>
            t.address.toLowerCase() === address.toLowerCase() ? { ...t, currentPrice: price } : t,
          ),
        })),

      clearDetectedTokens: () => set({ detectedTokens: [] }),
    }),
    {
      name: 'ginox-portfolio',
      // Persistence config:
      // - Uses localStorage (zustand/middleware default) to survive page refresh
      // - Only manualTokens are persisted via partialize — detectedTokens are
      //   re-fetched from the chain on each wallet reconnect
      // - Key: "ginox-portfolio" in localStorage
      partialize: (state) => ({ manualTokens: state.manualTokens }),
    },
  ),
);
