import { create } from 'zustand';
import type { TraderCard, SortField, SortDirection, Timeframe } from '@/shared/types';
import type { AsyncState } from '@/shared/types';

interface LeaderboardState {
  traders: AsyncState<TraderCard[]>;
  sortField: SortField;
  sortDirection: SortDirection;
  timeframe: Timeframe;
  searchQuery: string;
  page: number;
  hasMore: boolean;
  setTraders: (state: AsyncState<TraderCard[]>) => void;
  appendTraders: (newTraders: TraderCard[]) => void;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;
  setTimeframe: (tf: Timeframe) => void;
  setSearchQuery: (query: string) => void;
  incrementPage: () => void;
  resetPage: () => void;
  setHasMore: (hasMore: boolean) => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  traders: { status: 'idle' },
  sortField: 'roi',
  sortDirection: 'desc',
  timeframe: '7D',
  searchQuery: '',
  page: 1,
  hasMore: true,

  setTraders: (state) => set({ traders: state }),
  appendTraders: (newTraders) =>
    set((prev) => {
      if (prev.traders.status !== 'success') return prev;
      return {
        traders: { status: 'success', data: [...prev.traders.data, ...newTraders] },
      };
    }),
  setSortField: (field) => set({ sortField: field }),
  toggleSortDirection: () =>
    set((state) => ({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' })),
  setTimeframe: (tf) => set({ timeframe: tf, page: 1 }),
  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  incrementPage: () => set((state) => ({ page: state.page + 1 })),
  resetPage: () => set({ page: 1 }),
  setHasMore: (hasMore) => set({ hasMore }),
}));
