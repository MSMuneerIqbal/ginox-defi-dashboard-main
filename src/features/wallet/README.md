# Wallet Module

Handles wallet connectivity, on-chain data reading, chain management, and message signing.

## Components

- **WalletPanel** -- Main wallet UI. Shows connect prompt or connected state with balance/network info.
- **NetworkBadge** -- Colored badge displaying the current chain name.
- **SignMessageModal** -- EIP-712 typed data signing modal with signature display.
- **WrongNetworkBanner** -- Warning banner when connected to an unsupported chain.
- **ConnectWalletModal** -- Custom wallet picker modal. Replaces RainbowKit's built-in modal with a brand-aligned UI (centred card on desktop, bottom-sheet on mobile). Wired to wagmi's `useConnect` and the RainbowKit-configured connectors.

## Hooks

- **useWalletData** -- Aggregates all wallet state: connection, balances, chain switching, signing.

## Key Decisions

- Uses wagmi v2 hooks directly rather than wrapping ethers.js -- better type safety and tree-shaking.
- ERC-20 balance reading uses `useReadContract` with the standard ERC-20 ABI.
- User rejection errors are detected via message pattern matching and shown differently from network errors.
- The custom `ConnectWalletModal` portals to `document.body` via `react-dom`'s `createPortal` so it escapes any ancestor that creates a containing block for `position: fixed` (e.g. the header's `backdrop-filter`, glass cards' `transform`). All four modals in the app follow this same pattern.
- Mobile uses a native bottom-sheet pattern (slides up from the viewport edge with a 4px drag handle) -- mirrors what Coinbase Onchain Kit, Reown AppKit, and RainbowKit v2 ship in production.

## Wallet List

Eight EVM wallets are exposed through the custom modal:

| Group | Wallet |
| --- | --- |
| Popular | MetaMask, Coinbase Wallet, WalletConnect |
| More | Trust Wallet, Phantom, Rainbow, Ledger, Safe |

The connectors themselves are still configured via `connectorsForWallets` from `@rainbow-me/rainbowkit` in `src/config/wagmi.ts` -- only the modal UI shell is custom.
