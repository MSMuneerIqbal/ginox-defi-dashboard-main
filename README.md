# Ginox DeFi Trading Dashboard

A production-grade DeFi trading dashboard built with React 19, TypeScript, and wagmi v2. Features real wallet connectivity, live on-chain data, real-time price feeds from Binance, and a professional trading UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict mode) |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first config, no UI libs) |
| Web3 | wagmi v2 + viem + RainbowKit v2 |
| State Management | Zustand v5 |
| Data Fetching | TanStack React Query v5 |
| Charts | Custom SVG Donut + Sparkline Charts |
| Testing | Vitest v4 + Testing Library |
| Linting | ESLint + Prettier |
| Deployment | Vercel |

## Architecture

```
src/
  app/                     # Providers, Header
  features/
    wallet/                # Wallet Connect & On-Chain Data
    leaderboard/           # Trader Leaderboard
    ticker/                # Real-Time Price Ticker
    portfolio/             # On-Chain Portfolio Tracker
  shared/                  # Shared components, hooks, types, utils
  stores/                  # Zustand stores (one per domain)
  config/                  # Chain config, constants, wagmi setup
api/                       # Vercel serverless functions
```

### API Proxy Architecture

To avoid rate limiting and CORS issues, the app uses a proxy layer:

| Environment | CoinGecko | RPC (Ethereum, Polygon, etc.) |
|---|---|---|
| **Dev** (`npm run dev`) | Vite proxy → `api.coingecko.com` | Vite proxy → CORS-friendly public RPCs |
| **Dev** (with Alchemy key) | Vite proxy | Alchemy directly |
| **Production** (Vercel) | Edge Function at `/api/coingecko` (30s cache) | Alchemy directly |

### State Flow

```
Binance WebSocket --> tickerStore --> PriceTicker (Module 3)
                                 --> PortfolioView (Module 4, live prices for P&L)

Wallet (wagmi)    --> useWalletData --> WalletPanel (Module 1)
                                   --> usePortfolio (Module 4, token balances)

CoinGecko API     --> leaderboardStore --> LeaderboardView (Module 2)

localStorage      --> portfolioStore (persist middleware) --> PortfolioView (Module 4)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Web3 wallet (MetaMask recommended)
- WalletConnect Project ID (free at https://cloud.walletconnect.com)
- Alchemy API Key (free at https://alchemy.com — optional for dev, required for production)

### Installation

```bash
git clone <repo-url>
cd ginox-defi-dashboard
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required — from https://cloud.walletconnect.com
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional for dev (falls back to Vite RPC proxy), required for production
VITE_ALCHEMY_API_KEY=your_alchemy_key_here
```

### Development

```bash
npm run dev        # Start dev server at http://localhost:5173
```

The Vite dev server proxies all external API calls so there are no CORS issues:
- CoinGecko requests → proxied to `api.coingecko.com`
- RPC requests → proxied to CORS-friendly public RPCs per chain
- When `VITE_ALCHEMY_API_KEY` is set, RPC calls go directly to Alchemy

### Production Build

```bash
npm run build      # Type-check + production build to dist/
npm run preview    # Serve the production build locally at http://localhost:4173
```

### Running Tests

```bash
npm test           # 27 smoke tests (CI mode)
npm run test:watch # Watch mode for development
npm run lint       # ESLint
```

## Modules

### Module 1: Wallet Connect & On-Chain Data
- Multi-wallet support via RainbowKit (MetaMask, Coinbase, WalletConnect, Rainbow, Trust, Phantom, Ledger, Safe)
- Custom **ConnectWalletModal** — centred card on desktop, bottom-sheet on mobile
- Connection persists across page refresh
- Displays truncated address, native balance (ETH/BNB/MATIC/AVAX), and USDC balance
- Network badge with chain detection (8 supported chains)
- Chain switching with graceful rejection handling
- EIP-712 typed message signing with signature display
- Block explorer link per chain (Etherscan, Polygonscan, Arbiscan, etc.)

### Module 2: Live Trader Leaderboard
- Data sourced from CoinGecko API via Edge Function proxy (no client-side rate limiting)
- Responsive card grid with custom SVG sparkline charts
- Sort by ROI%, PNL, Volume (ascending/descending)
- Timeframe filter: 1D / 7D / 30D
- Debounced search (300ms) by name or address
- Detail modal with expanded stats and chart
- Client-side pagination (10 per page, 150 traders bulk-loaded)
- Skeleton loaders, error states, retry on rate limit

### Module 3: Real-Time Price Ticker
- Live BTC, ETH, BNB prices via Binance WebSocket
- Price, 24h change %, 24h volume
- Green/red flash animations on price movement
- Auto-reconnect with exponential backoff (max 5 retries)
- Connection status indicator (connected / reconnecting / disconnected)

### Module 4: On-Chain Portfolio Tracker
- Auto-loads native token balance from connected wallet
- P&L per token (mock entry price vs live price from Module 3)
- Custom SVG donut chart for portfolio allocation
- Total portfolio value and overall P&L
- Manual token addition (persisted to localStorage)
- Empty state prompts wallet connection

## Design System

- **Dark mode only** — page background `#010510`
- **Glassmorphism cards** with `backdrop-filter: blur(20px)` and inset shadows
- **No UI libraries** — Tailwind CSS v4 with CSS-first `@theme` configuration
- Color system: `#0AC488` (bullish), `#FF5757` (bearish), `#E0E7FF` (primary text)
- Accent gradient: `#0AC488` to `#33A0EA`
- Skeleton loaders on all async operations
- Fully responsive (mobile, tablet, desktop down to 340px)
- Custom scrollbar styling
- Geist + JetBrains Mono typography

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create ginox-defi-dashboard --public --push --source .
```

### 2. Deploy

```bash
npx vercel
```

Or import the repo at [vercel.com/new](https://vercel.com/new).

### 3. Set Environment Variables

In the Vercel dashboard → Project Settings → Environment Variables:

| Key | Value |
|---|---|
| `VITE_WALLETCONNECT_PROJECT_ID` | Your WalletConnect Project ID |
| `VITE_ALCHEMY_API_KEY` | Your Alchemy API key |

### 4. Redeploy

After setting env vars, redeploy from the Vercel dashboard. Vercel auto-detects Vite and uses:
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites handled by `vercel.json`

## Known Limitations

- Public RPC proxy only works in dev (Vite). Production requires an Alchemy key or additional Vercel serverless functions for RPC.
- CoinGecko free API has rate limits (~10-30 requests/minute). The Vercel Edge Function caches responses for 30 seconds to reduce load.
- Portfolio P&L uses mock entry prices since actual trade history requires indexer integration.
- ERC-20 token detection is limited to USDC on supported chains.
- Binance WebSocket may be blocked in certain regions.
