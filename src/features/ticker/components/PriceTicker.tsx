import { StatusBadge, SkeletonTicker } from '@/shared/components';
import { useWebSocket } from '../hooks/useWebSocket';
import { TickerCard } from './TickerCard';

const DISPLAY_ORDER = ['BTC', 'ETH', 'BNB'];

export function PriceTicker() {
  const { tickers, directions, connectionStatus, retryCount, reconnect } = useWebSocket();
  const hasData = Object.keys(tickers).length > 0;

  return (
    <section style={{ padding: '18px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="eyebrow" style={{ color: '#fff', fontWeight: 700 }}>Live Markets</span>
          <StatusBadge status={connectionStatus} />
          {connectionStatus === 'disconnected' && (
            <button className="btn btn-sm" onClick={reconnect} style={{ marginLeft: 4 }}>
              <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5" />
              </svg>
              Reconnect
            </button>
          )}
          {connectionStatus === 'reconnecting' && (
            <span style={{ fontSize: 11, color: 'var(--color-warning)', fontWeight: 500 }}>Retry {retryCount}/5</span>
          )}
        </div>
      </div>
      <div className="ticker-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {!hasData
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonTicker key={i} />)
          : DISPLAY_ORDER.map((symbol) => {
              const ticker = tickers[symbol];
              if (!ticker) return null;
              return (
                <TickerCard
                  key={symbol}
                  data={ticker}
                  direction={directions[symbol] ?? 'neutral'}
                />
              );
            })}
      </div>
    </section>
  );
}
