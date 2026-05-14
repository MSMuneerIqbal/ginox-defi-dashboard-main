# Ticker Module

Real-time cryptocurrency price feeds via Binance WebSocket.

## Components

- **PriceTicker** -- Main ticker display with connection status.
- **TickerCard** -- Individual price card with flash animations.

## Hooks

- **useWebSocket** -- Manages WebSocket lifecycle, message parsing, and reconnection.

## Reconnection Strategy

Uses exponential backoff with a max of 5 retries:
- Attempt 1: 1s delay
- Attempt 2: 2s delay
- Attempt 3: 4s delay
- Attempt 4: 8s delay
- Attempt 5: 16s delay

After 5 failed attempts, the connection status shows "Disconnected" with a manual reconnect button.

## Memory Leak Prevention

- `mountedRef` flag prevents state updates after component unmount
- WebSocket `onclose` handler is nullified before explicit close
- Retry timeouts are cleared on cleanup
