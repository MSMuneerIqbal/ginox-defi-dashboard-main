import { useState, useEffect, useRef, useMemo } from 'react';
import type { TickerData, PriceDirection } from '@/shared/types';
import { TokenIcon } from '@/shared/components';

interface TickerCardProps {
  data: TickerData;
  direction: PriceDirection;
}

function SparklineMini({ data, color, height = 36, width = 70 }: { data: number[]; color: string; height?: number; width?: number }) {
  const id = useMemo(() => `sg-${Math.random().toString(36).slice(2, 8)}`, []);

  if (!data || data.length < 2) return null;

  // Use the actual container dimensions for the viewBox so the SVG renders
  // 1:1 to its pixel bounds. Stretching a tiny viewBox to a large container
  // with preserveAspectRatio="none" produces moiré / scan-line artifacts on
  // mobile webkit at certain DPIs.
  const w = width;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, h - ((v - min) / span) * (h - 4) - 2]);
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function formatVolume(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export function TickerCard({ data }: TickerCardProps) {
  const [flashClass, setFlashClass] = useState('');
  const prevPriceRef = useRef(data.price);
  const priceHistoryRef = useRef<number[]>([]);
  const isPositive = data.changePercent24h >= 0;
  const color = isPositive ? 'var(--color-bullish)' : 'var(--color-bearish)';
  const rawColor = isPositive ? '#0AC488' : '#FF5757';

  useEffect(() => {
    if (prevPriceRef.current === data.price) return;
    const dir = data.price > prevPriceRef.current ? 'up' : 'down';
    setFlashClass(dir === 'up' ? 'flash-up' : 'flash-down');
    prevPriceRef.current = data.price;

    priceHistoryRef.current = [...priceHistoryRef.current.slice(-39), data.price];

    const timeout = setTimeout(() => setFlashClass(''), 600);
    return () => clearTimeout(timeout);
  }, [data.price]);

  if (priceHistoryRef.current.length === 0 && data.sparklineData) {
    priceHistoryRef.current = [...data.sparklineData];
  } else if (priceHistoryRef.current.length === 0) {
    const base = data.price;
    priceHistoryRef.current = Array.from({ length: 20 }, () => base * (0.99 + Math.random() * 0.02));
  }

  return (
    <div className={`glass lift ${flashClass}`} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
      <div style={{
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <TokenIcon symbol={data.symbol} size={34} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>{data.symbol}/USDT</span>
          <span className="num" style={{ color, display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 500, fontSize: 11 }}>
            {isPositive ? (
              <svg width={9} height={9} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v8M3 5l3-3 3 3" /></svg>
            ) : (
              <svg width={9} height={9} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10V2M3 7l3 3 3-3" /></svg>
            )}
            {Math.abs(data.changePercent24h).toFixed(2)}%
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 2 }}>
          <span className="num" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>
            ${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="num" style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>
            {formatVolume(data.volume24h)}
          </span>
        </div>
      </div>
      <div style={{ width: 70, height: 36, flexShrink: 0, overflow: 'hidden' }}>
        <SparklineMini data={priceHistoryRef.current} color={rawColor} height={36} width={70} />
      </div>
    </div>
  );
}
