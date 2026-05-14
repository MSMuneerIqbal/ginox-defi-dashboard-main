import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useClipboard } from '@/shared/hooks/useClipboard';
import { formatCurrency, formatPercent, formatVolume } from '@/shared/utils/format';
import { TokenIcon } from '@/shared/components';
import { Sparkline } from './Sparkline';
import { getRoiForTimeframe, getPnlForTimeframe } from '../utils/transform';
import type { TraderCard, Timeframe } from '@/shared/types';

interface TraderDetailModalProps {
  trader: TraderCard | null;
  isOpen: boolean;
  onClose: () => void;
}

const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: '1D', label: '24H' },
  { value: '7D', label: '7D' },
  { value: '30D', label: '30D' },
];

function sliceSparkline(data: number[], timeframe: Timeframe): number[] {
  if (!data || data.length === 0) return [];
  const len = data.length;
  // Sparkline is 7-day data from CoinGecko — slice proportionally per timeframe.
  switch (timeframe) {
    case '1D': return data.slice(Math.max(0, len - Math.ceil(len / 7)));
    case '7D': return data;
    case '30D': return data;
  }
}

export function TraderDetailModal({ trader, isOpen, onClose }: TraderDetailModalProps) {
  const { copied, copy } = useClipboard();
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('7D');

  const roi = trader ? getRoiForTimeframe(trader, activeTimeframe) : 0;
  const pnl = trader ? getPnlForTimeframe(trader, activeTimeframe) : 0;
  const pos = roi >= 0;

  const chartData = useMemo(() => {
    if (!trader) return [];
    const base = trader.sparklineData.length > 0
      ? trader.sparklineData
      : Array.from({ length: 24 }, () => 50 + Math.random() * 30);
    return sliceSparkline(base, activeTimeframe);
  }, [trader, activeTimeframe]);

  const chartPositive = useMemo(() => {
    if (chartData.length < 2) return pos;
    return chartData[chartData.length - 1] >= chartData[0];
  }, [chartData, pos]);

  if (!trader || !isOpen) return null;

  const color = pos ? 'var(--color-bullish)' : 'var(--color-bearish)';

  const timeframeLabels: Record<Timeframe, string> = {
    '1D': 'last 24 hours',
    '7D': 'last 7 days',
    '30D': 'last 30 days',
  };

  const changeLabel = activeTimeframe === '1D' ? '24h Change' : activeTimeframe === '7D' ? '7d Change' : '30d Change';
  const changeValue = activeTimeframe === '1D' ? trader.priceChange1d : activeTimeframe === '7D' ? trader.priceChange7d : trader.priceChange30d;

  const stats = [
    { label: 'Win rate', value: `${trader.winRate}%` },
    { label: 'Max DD', value: formatPercent(trader.maxDrawdown), accent: 'var(--color-bearish)' },
    { label: 'Volume', value: formatVolume(trader.volume) },
    { label: 'Market Cap', value: formatCurrency(trader.marketCap) },
    { label: 'Price', value: `$${trader.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}` },
    { label: changeLabel, value: formatPercent(changeValue), accent: changeValue >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)' },
    { label: 'Realized', value: formatCurrency(pnl), accent: pnl >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)' },
    { label: 'Symbol', value: trader.symbol },
  ];

  const etherscanUrl = `https://www.coingecko.com/en/coins/${trader.id}`;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} style={{ width: 720, maxHeight: 'calc(100vh - 48px)', overflow: 'auto' }}>
        <div style={{ padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {trader.image ? (
                <img src={trader.image} alt={trader.name} style={{ width: 52, height: 52, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }} />
              ) : (
                <TokenIcon symbol={trader.symbol} size={52} />
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>{trader.name}</span>
                  <span className="pill" style={{ background: 'var(--gradient-accent-soft)', borderColor: 'rgba(10,196,136,0.3)' }}>
                    {trader.symbol}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span className="num" style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{trader.address}</span>
                  <button
                    onClick={() => copy(trader.address)}
                    className="btn btn-ghost btn-sm"
                    style={{ width: 22, height: 22, padding: 0, justifyContent: 'center' }}
                  >
                    {copied ? (
                      <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3.5 3.5L13 5" /></svg>
                    ) : (
                      <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ width: 28, padding: 0, justifyContent: 'center' }}>
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="m4 4 8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div className="glass-deep" style={{ padding: 20 }}>
            <div className="modal-roi-row" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>ROI &middot; {timeframeLabels[activeTimeframe]}</div>
                <div className="num" style={{ fontSize: 'clamp(26px, 7vw, 34px)', fontWeight: 600, letterSpacing: '-0.03em', color, lineHeight: 1 }}>
                  {pos ? '+' : ''}{roi.toFixed(2)}%
                </div>
                <div className="num" style={{ marginTop: 6, fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {formatCurrency(pnl)} <span style={{ color: 'var(--color-text-dim)' }}>realized P&L</span>
                </div>
              </div>
              <div className="modal-timeframe-group" style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {TIMEFRAME_OPTIONS.map((tf) => (
                  <button
                    key={tf.value}
                    className="btn btn-sm"
                    onClick={() => setActiveTimeframe(tf.value)}
                    style={activeTimeframe === tf.value ? { background: 'var(--gradient-accent)', color: '#021018', borderColor: 'transparent' } : {}}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ height: 160, width: '100%', overflow: 'hidden' }}>
              <Sparkline data={chartData} width={640} height={160} positive={chartPositive} responsive />
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px' }}>
          <div className="modal-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--color-border)', borderRadius: 10, overflow: 'hidden' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ padding: 14, background: 'rgba(20,26,38,0.9)' }}>
                <div className="eyebrow" style={{ marginBottom: 5 }}>{s.label}</div>
                <div className="num" style={{ fontSize: 14, fontWeight: 500, color: s.accent || 'var(--color-text)' }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="modal-actions" style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => copy(trader.address)}>
              {copied ? (
                <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 3.5 3.5L13 5" /></svg>
              ) : (
                <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5" /><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" /></svg>
              )}
              {copied ? 'Copied' : 'Copy address'}
            </button>
            <button
              className="btn"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => window.open(etherscanUrl, '_blank', 'noopener,noreferrer')}
            >
              <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h4v4M13 3 8 8M7 5H4a1.5 1.5 0 0 0-1.5 1.5v5A1.5 1.5 0 0 0 4 13h5a1.5 1.5 0 0 0 1.5-1.5V9" /></svg>
              View on CoinGecko
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
