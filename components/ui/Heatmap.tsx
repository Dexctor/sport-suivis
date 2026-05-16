'use client';

import { useEffect, useState } from 'react';

// GitHub-style heatmap of activity over the last N weeks.
// Each cell = a day. Higher value -> brighter cell.
// Client-only render: this uses `new Date()` which differs between server (UTC, FR locale)
// and the visitor's machine. Rendering before mount would trigger a hydration mismatch.

export type HeatmapValue = { date: string; value: number };

export default function Heatmap({
  values,
  weeks = 16,
  cellSize = 12,
  gap = 3,
  legend,
  emptyColor = '#161616',
  fullColor = '#FF3B30',
}: {
  values: HeatmapValue[];
  weeks?: number;
  cellSize?: number;
  gap?: number;
  legend?: string;
  emptyColor?: string;
  fullColor?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const width = weeks * (cellSize + gap);
  const height = 7 * (cellSize + gap);

  if (!mounted) {
    // Stable placeholder with the exact same dimensions to avoid layout shift.
    return (
      <div>
        <div style={{ width, height, background: '#0F0F0F' }} />
        {legend && (
          <div className="rt-muted" style={{ fontSize: 10, marginTop: 8, letterSpacing: '0.05em' }}>
            {legend}
          </div>
        )}
      </div>
    );
  }

  const map = new Map(values.map((v) => [v.date, v.value]));

  // Build the grid - each column is a week (Mon..Sun)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Find this week's Monday
  const dow = (today.getDay() + 6) % 7; // Mon=0
  const startMonday = new Date(today);
  startMonday.setDate(today.getDate() - dow - (weeks - 1) * 7);

  const max = Math.max(1, ...values.map((v) => v.value));

  const cols: Array<Array<{ date: string; value: number; future: boolean }>> = [];
  for (let w = 0; w < weeks; w++) {
    const col: Array<{ date: string; value: number; future: boolean }> = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startMonday);
      date.setDate(startMonday.getDate() + w * 7 + d);
      const iso = date.toISOString().split('T')[0];
      const value = map.get(iso) || 0;
      const future = date > today;
      col.push({ date: iso, value, future });
    }
    cols.push(col);
  }

  // Convert hex like #FF3B30 to rgb
  const hex2rgb = (hex: string) => {
    const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!m) return [255, 59, 48];
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  };
  const [er, eg, eb] = hex2rgb(emptyColor);
  const [fr, fg, fb] = hex2rgb(fullColor);

  const colorFor = (val: number, future: boolean) => {
    if (future) return '#0A0A0A';
    if (val === 0) return emptyColor;
    const ratio = Math.min(1, val / max);
    // Slight power so low values still show
    const t = Math.pow(ratio, 0.6);
    const r = Math.round(er + (fr - er) * t);
    const g = Math.round(eg + (fg - eg) * t);
    const b = Math.round(eb + (fb - eb) * t);
    return `rgb(${r},${g},${b})`;
  };

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <svg width={width} height={height} style={{ display: 'block' }}>
          {cols.map((col, ci) =>
            col.map((cell, di) => (
              <rect
                key={`${ci}-${di}`}
                x={ci * (cellSize + gap)}
                y={di * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                fill={colorFor(cell.value, cell.future)}
                rx={2}
              >
                <title>
                  {cell.date} · {cell.value}
                </title>
              </rect>
            )),
          )}
        </svg>
      </div>
      {legend && (
        <div className="rt-muted" style={{ fontSize: 10, marginTop: 8, letterSpacing: '0.05em' }}>
          {legend}
        </div>
      )}
    </div>
  );
}
