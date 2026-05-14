import { useEffect, useCallback, useRef } from 'react';
import { useLeaderboardStore } from '@/stores/leaderboardStore';
import { COINGECKO_BASE_URL } from '@/config/constants';
import { transformCoinToTrader, getRoiForTimeframe, getPnlForTimeframe } from '../utils/transform';
import type { CoinGeckoMarket } from '../types';
import type { TraderCard, Timeframe } from '@/shared/types';

const PAGE_SIZE = 50;
const MAX_RETRIES = 3;
const INITIAL_PAGES = 3; // 3 × 50 = 150 traders

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES,
  backoff = 1500,
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);

      if (response.status === 429) {
        if (attempt < retries) {
          await delay(backoff * Math.pow(2, attempt));
          continue;
        }
        throw new Error('Rate limited by CoinGecko. Please wait a moment.');
      }

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      return response;
    } catch (err) {
      if (attempt < retries && err instanceof TypeError && (err as TypeError).message === 'Failed to fetch') {
        await delay(backoff * Math.pow(2, attempt));
        continue;
      }
      if (attempt === retries) throw err;
    }
  }
  throw new Error('Failed to fetch after retries');
}

async function fetchMarkets(page: number, _timeframe: Timeframe): Promise<CoinGeckoMarket[]> {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: PAGE_SIZE.toString(),
    page: page.toString(),
    sparkline: 'true',
    price_change_percentage: '24h,7d,30d',
    locale: 'en',
  });

  const response = await fetchWithRetry(`${COINGECKO_BASE_URL}/coins/markets?${params}`);
  return response.json();
}

async function fetchAllInitialPages(timeframe: Timeframe): Promise<CoinGeckoMarket[]> {
  const allData: CoinGeckoMarket[] = [];

  for (let page = 1; page <= INITIAL_PAGES; page++) {
    try {
      const data = await fetchMarkets(page, timeframe);
      allData.push(...data);

      // Small delay between pages to avoid rate limiting
      if (page < INITIAL_PAGES) await delay(300);
    } catch {
      // If a later page fails, return what we have
      break;
    }
  }

  return allData;
}

function sortTraders(
  traders: TraderCard[],
  field: 'roi' | 'pnl' | 'volume',
  direction: 'asc' | 'desc',
  timeframe: Timeframe,
): TraderCard[] {
  const getValue = (t: TraderCard): number => {
    if (field === 'roi') return getRoiForTimeframe(t, timeframe);
    if (field === 'pnl') return getPnlForTimeframe(t, timeframe);
    return t.volume;
  };
  return [...traders].sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);
    return direction === 'desc' ? bVal - aVal : aVal - bVal;
  });
}

function filterTraders(traders: TraderCard[], query: string): TraderCard[] {
  if (!query.trim()) return traders;
  const lower = query.toLowerCase();
  return traders.filter(
    (t) =>
      t.name.toLowerCase().includes(lower) ||
      t.symbol.toLowerCase().includes(lower) ||
      t.address.toLowerCase().includes(lower),
  );
}

export function useLeaderboard() {
  const {
    traders,
    sortField,
    sortDirection,
    timeframe,
    searchQuery,
    page,
    hasMore,
    setTraders,
    appendTraders,
    setSortField,
    toggleSortDirection,
    setTimeframe,
    setSearchQuery,
    incrementPage,
    resetPage,
    setHasMore,
  } = useLeaderboardStore();

  const loadingRef = useRef(false);

  const loadTraders = useCallback(
    async (pageNum: number, append = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      if (!append) {
        setTraders({ status: 'loading' });
      }

      try {
        let transformed: TraderCard[];

        if (!append && pageNum === 1) {
          // Initial load: fetch multiple pages
          const data = await fetchAllInitialPages(timeframe);
          transformed = data.map(transformCoinToTrader);
          setTraders({ status: 'success', data: transformed });
          setHasMore(transformed.length >= PAGE_SIZE * INITIAL_PAGES);
        } else {
          const data = await fetchMarkets(pageNum, timeframe);
          transformed = data.map(transformCoinToTrader);

          if (append) {
            appendTraders(transformed);
          } else {
            setTraders({ status: 'success', data: transformed });
          }

          setHasMore(data.length === PAGE_SIZE);
        }
      } catch (err) {
        if (!append) {
          setTraders({
            status: 'error',
            error: err instanceof Error ? err.message : 'Failed to load data',
          });
        }
      } finally {
        loadingRef.current = false;
      }
    },
    [timeframe, setTraders, appendTraders, setHasMore],
  );

  useEffect(() => {
    resetPage();
    loadTraders(1);
  }, [timeframe, loadTraders, resetPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || traders.status !== 'success') return;
    const nextPage = page + 1;
    incrementPage();
    loadTraders(nextPage, true);
  }, [hasMore, traders.status, page, incrementPage, loadTraders]);

  const processedTraders = (() => {
    if (traders.status !== 'success') return [];
    let result = filterTraders(traders.data, searchQuery);
    result = sortTraders(result, sortField, sortDirection, timeframe);
    return result;
  })();

  const handleSort = useCallback(
    (field: 'roi' | 'pnl' | 'volume') => {
      if (field === sortField) {
        toggleSortDirection();
      } else {
        setSortField(field);
      }
    },
    [sortField, setSortField, toggleSortDirection],
  );

  return {
    traders: processedTraders,
    status: traders.status,
    error: traders.status === 'error' ? traders.error : null,
    sortField,
    sortDirection,
    timeframe,
    searchQuery,
    hasMore,
    handleSort,
    setTimeframe,
    setSearchQuery,
    loadMore,
    reload: () => {
      loadingRef.current = false;
      loadTraders(1);
    },
  };
}
