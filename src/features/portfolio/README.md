# Portfolio Module

On-chain portfolio tracking with P&L calculation, allocation charts, and manual token management.

## Components

- **PortfolioView** -- Main portfolio display with summary cards and token list.
- **AllocationChart** -- Donut chart showing portfolio allocation percentages.
- **TokenRow** -- Individual token display with P&L breakdown.
- **AddTokenModal** -- Modal for manually adding tokens not auto-detected. Portals to `document.body` to escape glass-card stacking contexts.

## Hooks

- **usePortfolio** -- Aggregates detected and manual tokens, calculates P&L and allocations.

## Data Flow

1. When wallet connects, native token balance is auto-detected via wagmi's `useBalance`.
2. Live prices from the ticker store (Module 3) are cross-referenced for current valuation.
3. Mock entry prices simulate cost basis for P&L calculation.
4. Manual tokens are persisted to localStorage via Zustand's `persist` middleware.
5. Detected tokens refresh automatically on wallet/chain change.

## Storage

Manual token additions are persisted in localStorage under the key `ginox-portfolio`. Only manually added tokens are persisted -- auto-detected tokens are refreshed on each page load.
