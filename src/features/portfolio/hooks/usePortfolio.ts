import { useEffect, useMemo, useCallback } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useTickerStore } from '@/stores/tickerStore';
import type { PortfolioToken, PortfolioSummary, ChartAllocation } from '@/shared/types';

const CHART_COLORS = ['#0AC488', '#33A0EA', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

const MOCK_ENTRY_PRICES: Record<string, number> = {
  ETH: 2800,
  BNB: 550,
  BTC: 60000,
};

export function usePortfolio() {
  const { address, isConnected } = useAccount();
  const { manualTokens, detectedTokens, setDetectedTokens, addManualToken, removeManualToken, updateTokenPrice } = usePortfolioStore();
  const tickers = useTickerStore((s) => s.tickers);

  const { data: nativeBalance, isLoading: isBalanceLoading, isError: isBalanceError, error: balanceError } = useBalance({
    address,
    query: { enabled: isConnected },
  });

  useEffect(() => {
    if (!isConnected || !nativeBalance) {
      setDetectedTokens([]);
      return;
    }

    const symbol = nativeBalance.symbol;
    const balance = Number(nativeBalance.formatted);
    const livePrice = tickers[symbol]?.price ?? 0;
    const entryPrice = MOCK_ENTRY_PRICES[symbol] ?? livePrice * 0.85;

    const nativeToken: PortfolioToken = {
      address: '0x0000000000000000000000000000000000000000',
      symbol,
      name: `${symbol} (Native)`,
      balance,
      decimals: nativeBalance.decimals,
      entryPrice,
      currentPrice: livePrice || entryPrice,
      isManual: false,
    };

    setDetectedTokens([nativeToken]);
  }, [isConnected, nativeBalance, tickers, setDetectedTokens]);

  useEffect(() => {
    Object.entries(tickers).forEach(([symbol, ticker]) => {
      updateTokenPrice(
        symbol === 'ETH'
          ? '0x0000000000000000000000000000000000000000'
          : `mock-${symbol.toLowerCase()}`,
        ticker.price,
      );
    });
  }, [tickers, updateTokenPrice]);

  const allTokens = useMemo(() => {
    return [...detectedTokens, ...manualTokens];
  }, [detectedTokens, manualTokens]);

  const summary = useMemo((): PortfolioSummary => {
    const totalValue = allTokens.reduce((sum, t) => sum + t.balance * t.currentPrice, 0);
    const totalCost = allTokens.reduce((sum, t) => sum + t.balance * t.entryPrice, 0);
    const totalPnl = totalValue - totalCost;
    const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

    return { totalValue, totalPnl, totalPnlPercent, tokens: allTokens };
  }, [allTokens]);

  const allocations = useMemo((): ChartAllocation[] => {
    if (summary.totalValue === 0) return [];

    return allTokens
      .filter((t) => t.balance * t.currentPrice > 0)
      .map((t, i) => ({
        name: t.symbol,
        value: (t.balance * t.currentPrice / summary.totalValue) * 100,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [allTokens, summary.totalValue]);

  const handleAddManualToken = useCallback(
    (symbol: string, balance: number) => {
      const price = tickers[symbol]?.price ?? 0;
      const token: PortfolioToken = {
        address: `mock-${symbol.toLowerCase()}-${Date.now()}`,
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase(),
        balance,
        decimals: 18,
        entryPrice: price > 0 ? price * 0.9 : 100,
        currentPrice: price || 100,
        isManual: true,
      };
      addManualToken(token);
    },
    [tickers, addManualToken],
  );

  return {
    isConnected,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
    error: balanceError,
    allTokens,
    summary,
    allocations,
    addManualToken: handleAddManualToken,
    removeManualToken,
  };
}
