import type { ReactNode } from 'react';
import type { ChartAllocation } from '@/shared/types';

interface DonutProps {
  slices: Array<{ value: number; color: string; label: string }>;
  size?: number;
  thickness?: number;
  center?: ReactNode;
}

function Donut({ slices, size = 120, thickness = 14, center }: DonutProps) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  let acc = -Math.PI / 2;

  const arcs = slices.map((s) => {
    const angle = (s.value / total) * Math.PI * 2;
    const a0 = acc;
    const a1 = acc + angle;
    acc = a1;
    const large = angle > Math.PI ? 1 : 0;
    const x0 = c + r * Math.cos(a0);
    const y0 = c + r * Math.sin(a0);
    const x1 = c + r * Math.cos(a1);
    const y1 = c + r * Math.sin(a1);
    return {
      d: `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`,
      color: s.color,
    };
  });

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={thickness} />
        {arcs.map((a, i) => (
          <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={thickness} strokeLinecap="butt" />
        ))}
      </svg>
      {center && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {center}
        </div>
      )}
    </div>
  );
}

interface AllocationChartProps {
  data: ChartAllocation[];
  totalValue?: number;
}

export function AllocationChart({ data, totalValue }: AllocationChartProps) {
  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120, color: 'var(--color-text-muted)', fontSize: 13 }}>
        No allocation data
      </div>
    );
  }

  const slices = data.map(d => ({
    value: d.value,
    color: d.color,
    label: d.name,
  }));

  const fmtTotal = totalValue !== undefined
    ? totalValue >= 1e6 ? `$${(totalValue / 1e6).toFixed(2)}M`
    : totalValue >= 1e3 ? `$${(totalValue / 1e3).toFixed(2)}K`
    : `$${totalValue.toFixed(0)}`
    : undefined;

  return (
    <Donut
      slices={slices}
      size={120}
      thickness={14}
      center={fmtTotal ? (
        <>
          <span className="eyebrow" style={{ fontSize: 9 }}>Total</span>
          <span className="num" style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{fmtTotal}</span>
        </>
      ) : undefined}
    />
  );
}
