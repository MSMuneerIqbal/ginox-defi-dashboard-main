export interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency: number | null;
  price_change_percentage_7d_in_currency: number | null;
  price_change_percentage_30d_in_currency: number | null;
  sparkline_in_7d: { price: number[] } | null;
  ath: number;
  ath_change_percentage: number;
  atl: number;
  market_cap_rank: number;
}

export interface CoinGeckoDetailedCoin {
  id: string;
  market_data: {
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
  };
}
