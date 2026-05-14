interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 12, variant = 'rectangular', style }: SkeletonProps) {
  return (
    <div
      className="skel"
      style={{
        width,
        height,
        borderRadius: variant === 'circular' ? 999 : 4,
        ...style,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <div style={{ flex: 1 }}>
          <Skeleton width={80} height={14} />
          <Skeleton width={50} height={10} />
        </div>
      </div>
      <Skeleton height={20} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        <Skeleton height={32} />
        <Skeleton height={32} />
      </div>
    </div>
  );
}

export function SkeletonTicker() {
  return (
    <div className="glass" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <div style={{ flex: 1 }}>
        <Skeleton width={60} height={12} />
        <Skeleton width={100} height={18} />
      </div>
      <Skeleton width={70} height={36} />
    </div>
  );
}
