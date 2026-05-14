import { formatCurrency } from '@/shared/utils/format';
import { TokenIcon } from '@/shared/components';
import type { PortfolioToken } from '@/shared/types';

interface TokenRowProps {
  token: PortfolioToken;
  totalValue?: number;
  onRemove?: (address: string) => void;
}

export function TokenRow({ token, totalValue, onRemove }: TokenRowProps) {
  const value = token.balance * token.currentPrice;
  const costBasis = token.balance * token.entryPrice;
  const pnl = value - costBasis;
  const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
  const alloc = totalValue && totalValue > 0 ? (value / totalValue) * 100 : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', position: 'relative' }}>
      <TokenIcon symbol={token.symbol} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            {token.symbol}
            {token.isManual && (
              <span style={{ fontSize: 9, color: 'var(--color-text-dim)', background: 'rgba(255,255,255,0.04)', padding: '1px 5px', borderRadius: 4, border: '1px solid var(--color-border)' }}>
                manual
              </span>
            )}
          </span>
          <span className="num" style={{ fontSize: 13, fontWeight: 500 }}>{formatCurrency(value)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 1 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            <span className="num">{token.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}</span>
            {totalValue !== undefined && totalValue > 0 && (
              <span style={{ color: 'var(--color-text-dim)' }}> &middot; {alloc.toFixed(1)}%</span>
            )}
          </span>
          <span
            className="num"
            style={{
              color: pnl >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)',
              display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 500, fontSize: 11,
            }}
          >
            {pnl >= 0 ? (
              <svg width={9} height={9} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v8M3 5l3-3 3 3" /></svg>
            ) : (
              <svg width={9} height={9} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10V2M3 7l3 3 3-3" /></svg>
            )}
            {Math.abs(pnlPct).toFixed(2)}%
          </span>
        </div>
      </div>
      {token.isManual && onRemove && (
        <button
          onClick={() => onRemove(token.address)}
          className="btn btn-ghost btn-sm"
          style={{ width: 24, height: 24, padding: 0, justifyContent: 'center', opacity: 0.4, position: 'absolute', right: -4, top: 8 }}
          aria-label={`Remove ${token.symbol}`}
        >
          <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="m4 4 8 8M12 4l-8 8" />
          </svg>
        </button>
      )}
    </div>
  );
}
