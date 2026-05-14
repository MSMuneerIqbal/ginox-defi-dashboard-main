export const APP_NAME = 'Ginox';

export const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';

export const BINANCE_STREAMS = ['btcusdt@ticker', 'ethusdt@ticker', 'bnbusdt@ticker'] as const;

export const COINGECKO_BASE_URL = '/api/coingecko';

export const USDC_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
};

export const USDT_ADDRESSES: Record<number, `0x${string}`> = {
  1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  8453: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
  56: '0x55d398326f99059fF775485246999027B3197955',
  43114: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
  11155111: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
};

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'symbol',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

export const SEARCH_DEBOUNCE_MS = 300;

export const WS_RECONNECT_MAX_RETRIES = 5;

export const WS_RECONNECT_BASE_DELAY = 1000;

export const TICKER_SYMBOLS: Record<string, string> = {
  btcusdt: 'BTC',
  ethusdt: 'ETH',
  bnbusdt: 'BNB',
};

export const TIMEFRAMES = ['1D', '7D', '30D'] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

export const TIMEFRAME_DAYS: Record<Timeframe, number> = {
  '1D': 1,
  '7D': 7,
  '30D': 30,
};
