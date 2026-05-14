import { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  /** When true the SVG stretches to fill its container in both axes (used for the
   *  large modal chart). When false the SVG renders at fixed pixel dimensions
   *  (used for trader-card / ticker mini sparklines to avoid moiré artifacts). */
  responsive?: boolean;
}

export function Sparkline({ data, width = 100, height = 36, positive = true, responsive = false }: SparklineProps) {
  const { linePath, areaPath, gradientId, color } = useMemo(() => {
    const c = positive ? '#0AC488' : '#FF5757';
    const id = `sg-${Math.random().toString(36).slice(2, 8)}`;

    if (data.length < 2) return { linePath: '', areaPath: '', gradientId: id, color: c };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const stepX = width / (data.length - 1);
    const pts = data.map((v, i) => [i * stepX, height - ((v - min) / span) * (height - 4) - 2]);
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
    const area = `${line} L${width},${height} L0,${height} Z`;

    return { linePath: line, areaPath: area, gradientId: id, color: c };
  }, [data, positive, width, height]);

  if (data.length < 2) return null;

  // Mini sparklines (responsive=false) render at fixed pixel dimensions so the
  // viewBox matches the rendered size 1:1 — this avoids moiré / aliasing
  // patterns seen on mobile webkit when small viewBoxes get stretched.
  // The large modal chart (responsive=true) needs to fill its container, so we
  // omit width/height and let CSS handle sizing with preserveAspectRatio="none".
  return (
    <svg
      className="spark"
      viewBox={`0 0 ${width} ${height}`}
      {...(responsive
        ? { preserveAspectRatio: 'none' as const, style: { display: 'block', width: '100%', height: '100%' } }
        : { width, height, style: { display: 'block', maxWidth: '100%' } })}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
