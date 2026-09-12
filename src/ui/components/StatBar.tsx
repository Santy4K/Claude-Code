interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
}

export function StatBar({ label, value, max = 100, suffix }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {Math.round(value)}
        {suffix ?? ''}
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
