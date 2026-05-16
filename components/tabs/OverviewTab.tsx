'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Brain, Camera, Check, Play, Plus, Calendar } from 'lucide-react';
import type { AppState } from '../types';
import type { Phase, Session } from '@/lib/program';
import { PROGRAM } from '@/lib/program';
import { formatDate, todayISO } from '@/lib/helpers';
import StatCard from '../ui/StatCard';
import InfoBlock from '../ui/InfoBlock';
import Heatmap, { type HeatmapValue } from '../ui/Heatmap';
import type { TabId } from '../types';

export default function OverviewTab({
  state,
  currentWeight,
  progressPct,
  phase,
  week,
  targetThisWeek,
  sessionsThisWeek,
  todaySession,
  setActiveSession,
  setTab,
  onWeightLogged,
}: {
  state: AppState;
  currentWeight: number;
  progressPct: number;
  phase: Phase;
  week: number;
  targetThisWeek: number;
  sessionsThisWeek: number;
  todaySession: Session | null;
  setActiveSession: (s: Session) => void;
  setTab: (t: TabId) => void;
  onWeightLogged: () => Promise<void>;
}) {
  const [weightInput, setWeightInput] = useState('');
  const [saving, setSaving] = useState(false);

  const lost = (PROGRAM.startWeight - currentWeight).toFixed(1);
  const weekDiff = (currentWeight - targetThisWeek).toFixed(1);
  const chartData = state.weightLog.map((e) => ({ date: formatDate(e.date), weight: e.weight }));
  const heatmapValues: HeatmapValue[] = state.sessionLogs.map((s) => ({ date: s.date, value: 1 }));

  const logWeight = async () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w < 30 || w > 250) return;
    setSaving(true);
    await fetch('/api/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: todayISO(), weight: w }),
    });
    setWeightInput('');
    await onWeightLogged();
    setSaving(false);
  };

  return (
    <>
      {/* PHASE CARD */}
      <div
        className="rt-panel-elevated"
        style={{
          padding: 22,
          marginBottom: 20,
          borderLeft: `4px solid ${phase.type === 'cut' ? '#FF453A' : '#4ADE80'}`,
        }}
      >
        <div className="rt-muted" style={{ fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
          Phase {phase.num} sur 6 · Semaine {week - phase.startWeek + 1} sur {phase.endWeek - phase.startWeek + 1}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{phase.name}</div>
        <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 14, color: '#C8C8C8' }}>{phase.desc}</div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            padding: '12px 14px',
            background: 'var(--bg)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: 4,
          }}
        >
          <span className="rt-accent" style={{ fontWeight: 700 }}>À retenir cette phase&nbsp;: </span>
          {phase.focus}
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard label="Poids actuel" value={currentWeight.toFixed(1)} unit="kg" />
        <StatCard label="Objectif semaine" value={targetThisWeek.toFixed(1)} unit="kg" muted />
        <StatCard
          label="Écart"
          value={Number(weekDiff) > 0 ? `+${weekDiff}` : weekDiff}
          unit="kg"
          accent={Number(weekDiff) <= 0}
          warning={Number(weekDiff) > 0.5}
        />
        <StatCard
          label="Perdus au total"
          value={Number(lost) > 0 ? `-${lost}` : lost}
          unit="kg"
          accent={Number(lost) > 0}
        />
        <StatCard label="Objectif final" value={PROGRAM.targetWeight} unit="kg" muted />
      </div>

      {/* PROGRESS BAR */}
      <div className="rt-panel" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Progression globale</span>
          <span className="rt-mono-num rt-accent" style={{ fontSize: 16 }}>{progressPct.toFixed(1)}%</span>
        </div>
        <div className="rt-progress-track">
          <div className="rt-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span className="rt-muted" style={{ fontSize: 12 }}>Départ&nbsp;: {PROGRAM.startWeight} kg</span>
          <span className="rt-muted" style={{ fontSize: 12 }}>But&nbsp;: {PROGRAM.targetWeight} kg</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* TODAY'S SESSION */}
        <div className="rt-panel" style={{ padding: 22 }}>
          <div className="rt-section-label" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={14} /> Séance du jour
          </div>
          {todaySession ? (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                <span className="rt-accent" style={{ fontSize: 28, fontWeight: 800 }}>{todaySession.name}</span>
                <span className="rt-muted" style={{ fontSize: 13 }}>≈ {todaySession.duration} min</span>
              </div>
              <div style={{ fontSize: 15, marginBottom: 14 }}>{todaySession.focus}</div>
              <div className="rt-muted" style={{ fontSize: 13, marginBottom: 20 }}>
                {todaySession.exercises.length} exercices · {todaySession.exercises.reduce((s, e) => s + e.sets, 0)} séries au total
              </div>
              <button
                onClick={() => setActiveSession(todaySession)}
                className="rt-btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                }}
              >
                <Play size={16} fill="currentColor" /> Démarrer la séance
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Jour de repos</div>
              <div className="rt-muted" style={{ fontSize: 14, marginBottom: 18, lineHeight: 1.6 }}>
                Récupération active recommandée&nbsp;: 30 à 40 minutes de marche, vélo léger ou rameur à intensité modérée.
              </div>
              <button
                onClick={() => setTab('training')}
                className="rt-btn"
                style={{ padding: '12px 16px', fontSize: 13 }}
              >
                Voir tout le programme →
              </button>
            </>
          )}
        </div>

        {/* WEEK CHECKLIST */}
        <div className="rt-panel" style={{ padding: 22 }}>
          <div className="rt-section-label" style={{ marginBottom: 14 }}>Objectifs de la semaine</div>
          <Objective
            label="Séances réalisées"
            done={sessionsThisWeek >= 4}
            value={`${sessionsThisWeek} / 4`}
          />
          <Objective
            label="Tracking quotidien"
            done={false}
            value="à compléter"
            hint="Sommeil, protéines et cardio chaque jour"
          />
          <button
            onClick={() => setTab('daily')}
            className="rt-btn"
            style={{ width: '100%', marginTop: 16, padding: '12px', fontSize: 13 }}
          >
            Ouvrir le suivi du jour →
          </button>
        </div>
      </div>

      {/* WEIGHT LOG + CHART */}
      <div className="rt-panel" style={{ padding: 22, marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div className="rt-section-label">Évolution du poids</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="98.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="rt-input"
              style={{ padding: '10px 14px', width: 110 }}
              aria-label="Poids du jour en kilos"
            />
            <button
              onClick={logWeight}
              disabled={saving || !weightInput}
              className="rt-btn-primary"
              style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={14} /> {saving ? '…' : 'Ajouter'}
            </button>
          </div>
        </div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#8B8B8B"
                style={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
              />
              <YAxis
                stroke="#8B8B8B"
                style={{ fontSize: 12 }}
                domain={[PROGRAM.targetWeight - 2, PROGRAM.startWeight + 2]}
                tickLine={false}
                axisLine={{ stroke: '#262626' }}
              />
              <Tooltip
                contentStyle={{ background: '#121212', border: '1px solid #FF453A', fontSize: 13, borderRadius: 6 }}
                labelStyle={{ color: '#8B8B8B' }}
                itemStyle={{ color: '#FF453A' }}
              />
              <ReferenceLine
                y={PROGRAM.targetWeight}
                stroke="#4ADE80"
                strokeDasharray="4 4"
                label={{ value: 'cible', fill: '#4ADE80', fontSize: 11, position: 'right' }}
              />
              <ReferenceLine
                y={targetThisWeek}
                stroke="#FBBF24"
                strokeDasharray="2 4"
                label={{ value: 'sem.', fill: '#FBBF24', fontSize: 11, position: 'left' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#FF453A"
                strokeWidth={2.5}
                dot={{ fill: '#FF453A', r: 4 }}
                activeDot={{ r: 6, fill: '#FF453A' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rt-muted" style={{ fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>
          💡 Pèse-toi tous les jours au réveil à jeun, et juge la progression sur la moyenne hebdomadaire. Les
          fluctuations journalières sont normales (eau, sodium, digestion).
        </div>
      </div>

      {/* CONSISTENCY HEATMAP */}
      <div className="rt-panel" style={{ padding: 22, marginBottom: 20 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>
          Constance des séances · 16 dernières semaines
        </div>
        <Heatmap
          values={heatmapValues}
          weeks={16}
          legend={`${heatmapValues.length} séance${heatmapValues.length > 1 ? 's' : ''} enregistrée${heatmapValues.length > 1 ? 's' : ''}`}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <InfoBlock
          icon={Camera}
          title="Photos mensuelles"
          text="Une série de photos chaque mois, même angle, même éclairage, mêmes habits. Souvent plus parlant que la balance."
        />
        <InfoBlock
          icon={Brain}
          title="Le mental"
          text="Sur 11 mois, c'est la discipline qui décide, pas la motivation. Préparer ses repas le dimanche est plus efficace que résister chaque jour."
        />
      </div>
    </>
  );
}

function Objective({ label, value, done, hint }: { label: string; value: string; done: boolean; hint?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px dashed var(--border)',
        gap: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {hint && <div className="rt-muted" style={{ fontSize: 12, marginTop: 4 }}>{hint}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span className={`rt-mono-num ${done ? 'rt-success' : 'rt-muted'}`} style={{ fontSize: 14 }}>
          {value}
        </span>
        {done && <Check size={16} className="rt-success" />}
      </div>
    </div>
  );
}
