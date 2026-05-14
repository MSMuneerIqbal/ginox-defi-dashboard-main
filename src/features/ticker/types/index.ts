export interface BinanceTickerPayload {
  e: string;
  E: number;
  s: string;
  p: string;
  P: string;
  w: string;
  c: string;
  Q: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
}

export interface ParsedTicker {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export function parseBinanceTicker(data: BinanceTickerPayload): ParsedTicker {
  return {
    symbol: data.s.toLowerCase(),
    price: parseFloat(data.c),
    change24h: parseFloat(data.p),
    changePercent24h: parseFloat(data.P),
    volume24h: parseFloat(data.q),
    high24h: parseFloat(data.h),
    low24h: parseFloat(data.l),
  };
}
