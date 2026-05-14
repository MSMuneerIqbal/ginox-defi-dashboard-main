import type { CoinGeckoMarket } from '../types';
import type { TraderCard, Timeframe } from '@/shared/types';

/**
 * Deterministic metric generation. Derives per-coin "trader" characteristics
 * (leverage multiplier, win rate, drawdown) from a stable seed so values stay
 * consistent across refreshes. Production trader-aggregator services (Nansen,
 * DeBank Pro) compute these on-chain; we simulate to keep the assessment
 * focused on the dashboard layer.
 */
function deterministicMetrics(coin: CoinGeckoMarket): {
  roiMultiplier: number;
  winRate: number;
  maxDrawdown: number;
} {
  const seed = coin.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseSignal = coin.price_change_percentage_7d_in_currency ?? coin.price_change_percentage_24h ?? 0;

  return {
    roiMultiplier: 1 + (seed % 30) / 10,
    winRate: Math.min(Math.max(Math.round(40 + (seed % 40) + (baseSignal > 0 ? 10 : -5)), 20), 95),
    maxDrawdown: Math.round(-(5 + (seed % 25) + Math.abs(coin.ath_change_percentage) * 0.1) * 100) / 100,
  };
}

export function transformCoinToTrader(coin: CoinGeckoMarket): TraderCard {
  const m = deterministicMetrics(coin);
  const sparkline = coin.sparkline_in_7d?.price ?? [];
  const sampledSparkline = sparkline.length > 24
    ? sparkline.filter((_, i) => i % Math.floor(sparkline.length / 24) === 0).slice(0, 24)
    : sparkline;

  const priceChange1d = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0;
  const priceChange7d = coin.price_change_percentage_7d_in_currency ?? 0;
  const priceChange30d = coin.price_change_percentage_30d_in_currency ?? 0;

  const defaultRoi = Math.round(priceChange7d * m.roiMultiplier * 100) / 100;
  const defaultPnl = Math.round(coin.current_price * coin.total_volume * (priceChange7d / 100) * 0.00001 * 100) / 100;

  return {
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    image: coin.image,
    address: `0x${coin.id.slice(0, 4)}...${coin.id.slice(-4)}`,
    roi: defaultRoi,
    pnl: defaultPnl,
    winRate: m.winRate,
    maxDrawdown: m.maxDrawdown,
    volume: coin.total_volume,
    sparklineData: sampledSparkline,
    priceChange1d,
    priceChange7d,
    priceChange30d,
    roiMultiplier: m.roiMultiplier,
    currentPrice: coin.current_price,
    marketCap: coin.market_cap,
  };
}

/** Returns the raw price change % matching the active timeframe. */
export function getPriceChangeForTimeframe(trader: TraderCard, timeframe: Timeframe): number {
  switch (timeframe) {
    case '1D': return trader.priceChange1d;
    case '7D': return trader.priceChange7d;
    case '30D': return trader.priceChange30d;
  }
}

/** Trader ROI for the active timeframe = raw price change × deterministic leverage. */
export function getRoiForTimeframe(trader: TraderCard, timeframe: Timeframe): number {
  return Math.round(getPriceChangeForTimeframe(trader, timeframe) * trader.roiMultiplier * 100) / 100;
}

/** PnL scales with the active timeframe's price change. */
export function getPnlForTimeframe(trader: TraderCard, timeframe: Timeframe): number {
  const change = getPriceChangeForTimeframe(trader, timeframe);
  return Math.round(trader.currentPrice * trader.volume * (change / 100) * 0.00001 * 100) / 100;
}
