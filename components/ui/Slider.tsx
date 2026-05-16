'use client';

export default function Slider({
  label,
  value,
  onChange,
  min = 1,
  max = 10,
  unit = '',
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  const v = value === null ? min : value;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span className={`rt-mono-num ${value === null ? 'rt-muted' : 'rt-accent'}`} style={{ fontSize: 16 }}>
          {value === null ? '—' : v}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#FF453A', height: 28 }}
      />
      {value !== null && (
        <button
          onClick={() => onChange(null)}
          className="rt-link-btn"
          style={{ fontSize: 11, marginTop: 4 }}
        >
          Effacer cette valeur
        </button>
      )}
    </div>
  );
}
