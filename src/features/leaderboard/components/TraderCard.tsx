import { formatCurrency, formatPercent, truncateAddress } from '@/shared/utils/format';
import { TokenIcon } from '@/shared/components';
import { Sparkline } from './Sparkline';
import { getRoiForTimeframe, getPnlForTimeframe } from '../utils/transform';
import type { TraderCard as TraderCardType, Timeframe } from '@/shared/types';

interface TraderCardProps {
  trader: TraderCardType;
  rank: number;
  timeframe: Timeframe;
  onClick: (trader: TraderCardType) => void;
}

const TIMEFRAME_LABELS: Record<Timeframe, string> = {
  '1D': '24h',
  '7D': '7d',
  '30D': '30d',
};

function StatCell({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--color-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
      <div className="num" style={{ fontSize: 13, fontWeight: 500, color: accent || 'var(--color-text)' }}>{value}</div>
    </div>
  );
}

export function TraderCard({ trader, rank, timeframe, onClick }: TraderCardProps) {
  const roi = getRoiForTimeframe(trader, timeframe);
  const pnl = getPnlForTimeframe(trader, timeframe);
  const pos = roi >= 0;
  const color = pos ? 'var(--color-bullish)' : 'var(--color-bearish)';
  const rankMedal = rank <= 3;

  return (
    <button
      className="glass lift"
      onClick={() => onClick(trader)}
      style={{
        padding: 16, textAlign: 'left', cursor: 'pointer',
        background: 'var(--color-card)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex', flexDirection: 'column', gap: 14,
        position: 'relative', overflow: 'hidden',
        width: '100%',
      }}
    >
      <div style={{
        position: 'absolute', top: 12, right: 12,
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 10, fontFamily: 'var(--font-mono)',
        color: rankMedal ? '#021018' : 'var(--color-text-muted)',
        background: rankMedal ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.04)',
        padding: '3px 7px',
        borderRadius: 999,
        fontWeight: 600,
        border: rankMedal ? 'none' : '1px solid var(--color-border)',
      }}>
        #{String(rank).padStart(2, '0')}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {trader.image ? (
          <img
            src={trader.image}
            alt={trader.name}
            style={{ width: 36, height: 36, borderRadius: 999, flexShrink: 0, background: 'rgba(255,255,255,0.06)' }}
            loading="lazy"
          />
        ) : (
          <TokenIcon symbol={trader.symbol} size={36} />
        )}
        <div style={{ minWidth: 0, flex: 1, paddingRight: 40 }}>
          <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{trader.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span className="num" style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{truncateAddress(trader.address)}</span>
            <span style={{ fontSize: 10, color: 'var(--color-text-dim)' }}>&middot;</span>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{trader.symbol}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--color-text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>ROI &middot; {TIMEFRAME_LABELS[timeframe]}</div>
          <div className="num" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', color }}>
            {pos ? '+' : ''}{roi.toFixed(1)}%
          </div>
        </div>
        <div style={{ width: 100, height: 40, flexShrink: 0 }}>
          <Sparkline data={trader.sparklineData} width={100} height={40} positive={pos} />
        </div>
      </div>

      <div className="div-h" />

      <div className="trader-stats" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
        <StatCell label="PNL" value={formatCurrency(pnl)} accent={pnl >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)'} />
        <StatCell label="Win Rate" value={`${trader.winRate}%`} />
        <StatCell label="Max DD" value={formatPercent(trader.maxDrawdown)} accent="var(--color-bearish)" />
        <StatCell label="Volume" value={formatCurrency(trader.volume)} />
      </div>
    </button>
  );
}
