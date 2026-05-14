# Leaderboard Module

Fetches and displays crypto trader/token data from CoinGecko with sorting, filtering, and detail views.

## Components

- **LeaderboardView** -- Main view with filters, card grid, and client-side pagination.
- **TraderCard** -- Individual trader card with sparkline chart and key metrics. Reactive to the active timeframe.
- **LeaderboardFilters** -- Search bar, timeframe selector (1D / 7D / 30D), and sort controls.
- **TraderDetailModal** -- Expanded view with full stats and a responsive larger chart. Portals to `document.body` for proper layering. The modal has its own timeframe selector that mirrors the global one.
- **Pagination** -- Custom client-side pagination control (10 per page).
- **Sparkline** -- Custom SVG sparkline chart with gradient fill. Has a `responsive` mode for the large modal chart and a fixed-pixel default mode for mini sparklines (avoids the moiré aliasing seen on mobile webkit when small viewBoxes are stretched).

## Hooks

- **useLeaderboard** -- Data fetching, sorting, filtering, and pagination logic.

## Data Pipeline

CoinGecko `/coins/markets` response (`price_change_percentage=24h,7d,30d`, `sparkline=true`) is transformed into a `TraderCard`:

- The raw `priceChange1d`, `priceChange7d`, `priceChange30d` percentages are stored on the card.
- A deterministic `roiMultiplier` (1.0 -- 4.0) is generated from a hash of the coin id to simulate trader leverage.
- `getRoiForTimeframe(trader, tf)` and `getPnlForTimeframe(trader, tf)` derive the displayed ROI / PnL on demand -- so toggling the timeframe re-renders cards with the correct value rather than fetching new data.
- `winRate` and `maxDrawdown` are derived deterministically from coin metadata (id hash + ATH change percentage) so values stay stable across refreshes.

Sorting also respects the active timeframe -- ranking by ROI on 1D yields a different order than 7D / 30D.

## Data Loading

- Initial load fetches **3 pages × 50 coins = 150 traders** in sequence, with a 300ms delay between pages to stay under CoinGecko's free-tier rate limit.
- 429 responses trigger exponential backoff (1.5s × 2^attempt), max 3 retries.
- Errors surface a retry button; cached results stay visible if a later page fails.
