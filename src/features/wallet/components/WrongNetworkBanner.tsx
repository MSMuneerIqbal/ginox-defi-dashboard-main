interface WrongNetworkBannerProps {
  chainName: string;
  targetName: string;
  onSwitch: () => void;
  isSwitching?: boolean;
}

export function WrongNetworkBanner({ chainName, targetName, onSwitch, isSwitching }: WrongNetworkBannerProps) {
  return (
    <div style={{
      padding: 12,
      background: 'rgba(245,181,68,0.08)',
      border: '1px solid rgba(245,181,68,0.25)',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 12,
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 999,
        background: 'rgba(245,181,68,0.15)', color: 'var(--color-warning)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M8 4v4M8 11v.5" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>Wrong network</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
          Connected to {chainName}. Switch to {targetName} to continue.
        </div>
      </div>
      <button
        className="btn btn-sm"
        onClick={onSwitch}
        disabled={isSwitching}
        style={{ background: 'rgba(245,181,68,0.15)', borderColor: 'rgba(245,181,68,0.3)', color: 'var(--color-warning)' }}
      >
        {isSwitching ? 'Switching...' : 'Switch'}
      </button>
    </div>
  );
}
