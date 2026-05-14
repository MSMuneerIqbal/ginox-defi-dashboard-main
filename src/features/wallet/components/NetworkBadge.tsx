interface NetworkBadgeProps {
  label: string;
  color: string;
}

export function NetworkBadge({ label, color }: NetworkBadgeProps) {
  return (
    <span className="pill" style={{ height: 24, paddingLeft: 6, paddingRight: 10 }}>
      <span className="chain-chip" style={{ background: color, color: '#fff' }}>
        {label[0]}
      </span>
      <span>{label}</span>
    </span>
  );
}
