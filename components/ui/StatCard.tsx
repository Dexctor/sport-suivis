'use client';

export default function StatCard({
  label, value, unit, accent, muted, warning,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: boolean;
  muted?: boolean;
  warning?: boolean;
}) {
  const colorClass = warning ? 'rt-warning' : accent ? 'rt-accent' : muted ? 'rt-muted' : '';
  return (
    <div className="rt-panel" style={{ padding: 16 }}>
      <div className="rt-muted" style={{ fontSize: 12, marginBottom: 8, fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className={`rt-mono-num ${colorClass}`} style={{ fontSize: 26 }}>
          {value}
        </span>
        {unit && <span className="rt-muted" style={{ fontSize: 13 }}>{unit}</span>}
      </div>
    </div>
  );
}
