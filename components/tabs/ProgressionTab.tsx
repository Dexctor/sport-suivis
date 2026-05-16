'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { PROGRAM, type Exercise } from '@/lib/program';
import type { SessionLog } from '../types';
import { formatDate } from '@/lib/helpers';

type ExerciseHistoryRow = {
  date: string;
  top_weight: number;
  volume: number;
  top_reps: number;
  sets: number;
};

const ALL_EXERCISES: (Exercise & { sessionName: string })[] = PROGRAM.sessions.flatMap((s) =>
  s.exercises.map((e) => ({ ...e, sessionName: s.name })),
);

export default function ProgressionTab({ sessionLogs }: { sessionLogs: SessionLog[] }) {
  const exercisesWithHistory = useMemo(() => {
    const seen = new Set<string>();
    sessionLogs.forEach((s) => Object.keys(s.exercises || {}).forEach((id) => seen.add(id)));
    return ALL_EXERCISES.filter((e) => seen.has(e.id));
  }, [sessionLogs]);

  const [selectedId, setSelectedId] = useState<string>(exercisesWithHistory[0]?.id || ALL_EXERCISES[0].id);
  const [history, setHistory] = useState<ExerciseHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/exercises?exerciseId=${encodeURIComponent(selectedId)}`);
        if (res.ok && !cancelled) setHistory(await res.json());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const selectedExo = ALL_EXERCISES.find((e) => e.id === selectedId);
  const chartData = history.map((h) => ({
    date: formatDate(h.date),
    weight: Number(h.top_weight),
    volume: Math.round(Number(h.volume)),
  }));

  const allTimeTop = history.length > 0 ? Math.max(...history.map((h) => Number(h.top_weight))) : 0;
  const lastTop = history.length > 0 ? Number(history[history.length - 1].top_weight) : 0;
  const firstTop = history.length > 0 ? Number(history[0].top_weight) : 0;
  const delta = lastTop - firstTop;

  return (
    <>
      <div className="rt-section-label" style={{ marginBottom: 18 }}>
        Progression des charges · évolution par exercice
      </div>

      <div className="rt-panel" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Choisis un exercice</div>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rt-input"
          style={{ width: '100%', padding: '12px 14px', fontSize: 15 }}
        >
          {PROGRAM.sessions.map((s) => (
            <optgroup key={s.id} label={`${s.name} · ${s.focus}`}>
              {s.exercises.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                  {!exercisesWithHistory.find((x) => x.id === e.id) ? '  (jamais loggé)' : ''}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {selectedExo && (
        <div className="rt-panel-elevated" style={{ padding: 20, marginBottom: 18, borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{selectedExo.name}</div>
          <div className="rt-muted" style={{ fontSize: 13, marginBottom: 14 }}>
            {selectedExo.sets} × {selectedExo.reps} · repos {selectedExo.rest}&nbsp;s · {selectedExo.type}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: '#C8C8C8' }}>{selectedExo.tip}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Stat label="Record absolu" value={allTimeTop.toFixed(1)} unit="kg" accent />
        <Stat label="Dernière séance" value={lastTop > 0 ? lastTop.toFixed(1) : '—'} unit="kg" />
        <Stat
          label="Évolution"
          value={delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
          unit="kg"
          accent={delta > 0}
          warning={delta < 0}
        />
        <Stat label="Séances loggées" value={history.length} />
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <TrendingUp size={16} className="rt-accent" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Poids le plus lourd par séance</span>
        </div>
        <div style={{ height: 240 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#8B8B8B" style={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#262626' }} />
                <YAxis stroke="#8B8B8B" style={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#262626' }} />
                <Tooltip
                  contentStyle={{ background: '#121212', border: '1px solid #FF453A', fontSize: 13, borderRadius: 6 }}
                  labelStyle={{ color: '#8B8B8B' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#FF453A" strokeWidth={2.5} dot={{ fill: '#FF453A', r: 4 }} activeDot={{ r: 6 }} name="Poids max (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty label={loading ? 'Chargement…' : 'Aucune donnée pour cet exercice. Lance une séance et log les charges.'} />
          )}
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <TrendingUp size={16} className="rt-accent" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Volume total (kg × reps)</span>
        </div>
        <div style={{ height: 220 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#8B8B8B" style={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#262626' }} />
                <YAxis stroke="#8B8B8B" style={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#262626' }} />
                <Tooltip contentStyle={{ background: '#121212', border: '1px solid #4ADE80', fontSize: 13, borderRadius: 6 }} labelStyle={{ color: '#8B8B8B' }} />
                <Line type="monotone" dataKey="volume" stroke="#4ADE80" strokeWidth={2.5} dot={{ fill: '#4ADE80', r: 4 }} activeDot={{ r: 6 }} name="Volume (kg·reps)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty label="—" />
          )}
        </div>
      </div>

      <div className="rt-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
        💡 Le poids le plus lourd montre ton plafond de force, le volume reflète le travail total accompli. Les deux
        doivent progresser sur le long terme. Une stagnation de 3 à 4 semaines = vérifier sommeil, alimentation, ou
        faire une semaine de deload.
      </div>
    </>
  );
}

function Stat({ label, value, unit, accent, warning }: { label: string; value: string | number; unit?: string; accent?: boolean; warning?: boolean }) {
  const cls = warning ? 'rt-warning' : accent ? 'rt-accent' : '';
  return (
    <div className="rt-panel" style={{ padding: 14 }}>
      <div className="rt-muted" style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className={`rt-mono-num ${cls}`} style={{ fontSize: 22 }}>{value}</span>
        {unit && <span className="rt-muted" style={{ fontSize: 12 }}>{unit}</span>}
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rt-muted" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 13 }}>
      {label}
    </div>
  );
}
