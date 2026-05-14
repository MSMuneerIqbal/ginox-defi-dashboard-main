import { useEffect, useRef, useCallback } from 'react';
import { useTickerStore } from '@/stores/tickerStore';
import { BINANCE_WS_URL, BINANCE_STREAMS, WS_RECONNECT_MAX_RETRIES, WS_RECONNECT_BASE_DELAY, TICKER_SYMBOLS } from '@/config/constants';
import { parseBinanceTicker } from '../types';
import type { BinanceTickerPayload } from '../types';

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mountedRef = useRef(true);

  const { setTicker, setConnectionStatus, incrementRetry, resetRetry, retryCount, connectionStatus, tickers, directions } = useTickerStore();

  const connect = useCallback(() => {
    if (!mountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const streams = BINANCE_STREAMS.join('/');
    const url = `${BINANCE_WS_URL}/${streams}`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setConnectionStatus('connected');
        resetRetry();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const raw = JSON.parse(event.data) as BinanceTickerPayload;
          const parsed = parseBinanceTicker(raw);
          const symbolKey = parsed.symbol.replace('usdt', '');
          const displaySymbol = TICKER_SYMBOLS[parsed.symbol] ?? symbolKey.toUpperCase();

          setTicker(displaySymbol, {
            symbol: displaySymbol,
            price: parsed.price,
            change24h: parsed.change24h,
            changePercent24h: parsed.changePercent24h,
            volume24h: parsed.volume24h,
            high24h: parsed.high24h,
            low24h: parsed.low24h,
            prevPrice: 0,
          });
        } catch {
          // malformed message, skip
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        wsRef.current = null;
        handleReconnect();
      };

      ws.onerror = () => {
        if (!mountedRef.current) return;
        ws.close();
      };
    } catch {
      handleReconnect();
    }
  }, [setTicker, setConnectionStatus, resetRetry]);

  const handleReconnect = useCallback(() => {
    const currentRetry = useTickerStore.getState().retryCount;

    if (currentRetry >= WS_RECONNECT_MAX_RETRIES) {
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('reconnecting');
    incrementRetry();

    const delay = WS_RECONNECT_BASE_DELAY * Math.pow(2, currentRetry);

    retryTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) connect();
    }, delay);
  }, [connect, setConnectionStatus, incrementRetry]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    clearTimeout(retryTimeoutRef.current);
    setConnectionStatus('disconnected');
  }, [setConnectionStatus]);

  const reconnect = useCallback(() => {
    disconnect();
    resetRetry();
    connect();
  }, [disconnect, resetRetry, connect]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      clearTimeout(retryTimeoutRef.current);
    };
  }, [connect]);

  return {
    tickers,
    directions,
    connectionStatus,
    retryCount,
    reconnect,
  };
}
