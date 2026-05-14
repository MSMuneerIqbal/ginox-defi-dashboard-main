interface StatusBadgeProps {
  status: 'connected' | 'reconnecting' | 'disconnected';
  label?: string;
}

const statusConfig = {
  connected: { cls: 'dot-live', label: 'Live' },
  reconnecting: { cls: 'dot-warn', label: 'Reconnecting…' },
  disconnected: { cls: 'dot-offline', label: 'Disconnected' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
      <span className={`dot ${config.cls}`} />
      {label || config.label}
    </span>
  );
}
