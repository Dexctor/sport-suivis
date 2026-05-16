'use client';

import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { PHASES, PROGRAM, type Phase } from '@/lib/program';
import { getTargetWeightForWeek } from '@/lib/helpers';

export default function TimelineTab({ week }: { week: number }) {
  const phasesWithProgress = PHASES.map((p) => ({
    ...p,
    completed: week > p.endWeek,
    current: week >= p.startWeek && week <= p.endWeek,
    upcoming: week < p.startWeek,
  }));

  const weeklyTargets = useMemo(() => {
    const data: Array<{ week: string; target: number }> = [];
    for (let w = 1; w <= PROGRAM.totalWeeks; w++) {
      data.push({ week: `S${w}`, target: getTargetWeightForWeek(w) });
    }
    return data;
  }, []);

  return (
    <>
      <div className="rt-section-label" style={{ marginBottom: 18 }}>
        Roadmap 11 mois · approche multi-phase
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 24 }}>
        <div style={{ fontSize: 14, marginBottom: 18, lineHeight: 1.6, color: '#C8C8C8' }}>
          La science récente sur la perte de gras à long terme recommande une approche multi-phase avec des breaks de
          maintenance entre les cuts. Cela prévient l&apos;adaptation métabolique (chute du TDEE), restaure les
          hormones (leptine, T3, testostérone) et minimise la perte musculaire.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <SummaryStat label="Durée totale" value={`~${PROGRAM.totalWeeks}`} unit="semaines" sub="environ 11 mois" />
          <SummaryStat label="Poids à perdre" value={`${PROGRAM.startWeight - PROGRAM.targetWeight}`} unit="kg" />
          <SummaryStat label="Masse grasse cible" value={`${PROGRAM.targetBF}`} unit="%" sub={`au lieu de ${PROGRAM.startBF}% au début`} />
          <SummaryStat label="Rythme moyen" value="0,4" unit="kg / semaine" />
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 24 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>Courbe cible de poids</div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTargets} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" stroke="#8B8B8B" style={{ fontSize: 11 }} interval={4} tickLine={false} axisLine={{ stroke: '#262626' }} />
              <YAxis stroke="#8B8B8B" style={{ fontSize: 12 }} domain={[PROGRAM.targetWeight - 2, PROGRAM.startWeight + 2]} tickLine={false} axisLine={{ stroke: '#262626' }} />
              <Tooltip contentStyle={{ background: '#121212', border: '1px solid #FF453A', fontSize: 13, borderRadius: 6 }} labelStyle={{ color: '#8B8B8B' }} />
              <ReferenceLine y={PROGRAM.targetWeight} stroke="#4ADE80" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="target" stroke="#FF453A" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rt-section-label" style={{ marginBottom: 14 }}>Phases détaillées</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {phasesWithProgress.map((p) => (
          <PhaseCard key={p.num} phase={p} />
        ))}
      </div>
    </>
  );
}

function SummaryStat({ label, value, unit, sub }: { label: string; value: string; unit: string; sub?: string }) {
  return (
    <div>
      <div className="rt-muted" style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div className="rt-accent rt-mono-num" style={{ fontSize: 26 }}>
        {value} <span className="rt-muted" style={{ fontSize: 13, fontWeight: 400 }}>{unit}</span>
      </div>
      {sub && <div className="rt-muted" style={{ fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PhaseCard({ phase }: { phase: Phase & { completed?: boolean; current?: boolean; upcoming?: boolean } }) {
  const status = phase.completed ? 'Terminée' : phase.current ? 'En cours' : 'À venir';
  const statusColor = phase.completed ? '#4ADE80' : phase.current ? '#FF453A' : '#5A5A5A';
  const isCut = phase.type === 'cut';
  return (
    <div
      className="rt-panel"
      style={{
        padding: 18,
        borderLeft: `4px solid ${statusColor}`,
        opacity: phase.upcoming ? 0.6 : 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 14,
          flexWrap: 'wrap',
          marginBottom: 10,
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 6 }}>
            <span className="rt-mono-num rt-accent" style={{ fontSize: 15 }}>P{phase.num}</span>
            <span style={{ fontSize: 16, fontWeight: 800 }}>{phase.name}</span>
          </div>
          <div className="rt-muted" style={{ fontSize: 12 }}>
            Semaines {phase.startWeek} à {phase.endWeek} · {phase.endWeek - phase.startWeek + 1}&nbsp;sem ·{' '}
            {isCut ? 'Déficit' : 'Maintenance'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: statusColor, marginBottom: 4 }}>
            {status.toUpperCase()}
          </div>
          <div className="rt-mono-num" style={{ fontSize: 15 }}>
            {phase.startWeight}
            <span className="rt-muted"> → </span>
            {phase.endWeight}
            <span className="rt-muted" style={{ fontSize: 11 }}> kg</span>
          </div>
        </div>
      </div>
      <div className="rt-muted" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{phase.desc}</div>
      <div
        style={{
          fontSize: 12,
          lineHeight: 1.6,
          padding: '10px 12px',
          background: 'var(--bg)',
          borderLeft: `3px solid ${statusColor}`,
          borderRadius: 4,
        }}
      >
        <span style={{ color: statusColor, fontWeight: 700 }}>À retenir&nbsp;: </span>
        <span style={{ color: '#C8C8C8' }}>{phase.focus}</span>
      </div>
    </div>
  );
}
