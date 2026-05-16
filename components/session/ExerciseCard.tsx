'use client';

import { useState } from 'react';
import { Check, Timer, ChevronDown, ChevronUp } from 'lucide-react';
import type { Exercise } from '@/lib/program';
import type { SetLog } from '../types';

export default function ExerciseCard({
  exercise,
  index,
  sets,
  onUpdateSet,
  onToggleDone,
  onStartRest,
}: {
  exercise: Exercise;
  index: number;
  sets: SetLog[];
  onUpdateSet: (setIdx: number, field: 'w' | 'r', value: string) => void;
  onToggleDone: (setIdx: number) => void;
  onStartRest: () => void;
}) {
  const [showTip, setShowTip] = useState(false);
  const doneCount = sets.filter((s) => s.done).length;
  const allDone = doneCount === exercise.sets;

  return (
    <div
      className="rt-panel"
      style={{
        padding: 18,
        opacity: allDone ? 0.7 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Header: name, sets×reps, type */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="rt-mono-num rt-muted" style={{ fontSize: 12 }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, lineHeight: 1.25 }}>{exercise.name}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="rt-accent" style={{ fontSize: 14, fontWeight: 700 }}>
              {exercise.sets} × {exercise.reps}
            </span>
            <span className="rt-muted" style={{ fontSize: 12 }}>·</span>
            <span className="rt-muted" style={{ fontSize: 12 }}>repos {exercise.rest}&nbsp;s</span>
            <span className="rt-muted" style={{ fontSize: 12 }}>·</span>
            <span className="rt-muted" style={{ fontSize: 12 }}>{exercise.type}</span>
          </div>
        </div>
        <div
          className={`rt-mono-num ${allDone ? 'rt-success' : 'rt-muted'}`}
          style={{
            fontSize: 13,
            padding: '4px 10px',
            background: allDone ? 'var(--success-soft)' : 'var(--bg-2)',
            border: `1px solid ${allDone ? 'rgba(74, 222, 128, 0.3)' : 'var(--border)'}`,
            borderRadius: 6,
          }}
        >
          {doneCount}/{exercise.sets}
        </div>
      </div>

      {/* Technique toggle */}
      <button
        onClick={() => setShowTip((v) => !v)}
        className="rt-link-btn"
        style={{ marginTop: 6, marginBottom: 12, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
      >
        {showTip ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {showTip ? 'Masquer la technique' : 'Voir la technique'}
      </button>
      {showTip && (
        <div
          style={{
            padding: 12,
            background: 'var(--bg)',
            borderLeft: '3px solid var(--accent)',
            marginBottom: 16,
            fontSize: 12,
            lineHeight: 1.6,
            borderRadius: 4,
          }}
        >
          {exercise.tip}
        </div>
      )}

      {/* Table-like rows: each set */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sets.map((set, setIdx) => (
          <SetRow
            key={setIdx}
            setIdx={setIdx}
            set={set}
            onUpdate={(field, value) => onUpdateSet(setIdx, field, value)}
            onToggleDone={() => onToggleDone(setIdx)}
          />
        ))}
      </div>

      {/* Rest button */}
      <button
        onClick={onStartRest}
        className="rt-btn"
        style={{
          width: '100%',
          marginTop: 14,
          padding: 12,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: 'var(--accent-soft)',
          color: 'var(--accent)',
          borderColor: 'rgba(255, 69, 58, 0.3)',
          fontWeight: 700,
        }}
      >
        <Timer size={14} /> Lancer le repos ({exercise.rest} s)
      </button>
    </div>
  );
}

function SetRow({
  setIdx,
  set,
  onUpdate,
  onToggleDone,
}: {
  setIdx: number;
  set: SetLog;
  onUpdate: (field: 'w' | 'r', value: string) => void;
  onToggleDone: () => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '36px 1fr 1fr 44px',
        gap: 8,
        alignItems: 'center',
        padding: 8,
        background: set.done ? 'var(--success-soft)' : 'var(--bg)',
        border: `1px solid ${set.done ? 'rgba(74, 222, 128, 0.25)' : 'var(--border)'}`,
        borderRadius: 6,
        transition: 'background 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: set.done ? 'var(--success)' : 'var(--bg-2)',
          color: set.done ? '#000' : 'var(--muted)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        S{setIdx + 1}
      </div>
      <div>
        <input
          type="number"
          inputMode="decimal"
          step="0.5"
          value={set.w}
          onChange={(e) => onUpdate('w', e.target.value)}
          placeholder="kg"
          className="rt-input"
          style={{ width: '100%', padding: '10px 12px', fontSize: 16, textAlign: 'center', fontWeight: 700 }}
          aria-label={`Poids série ${setIdx + 1}`}
        />
      </div>
      <div>
        <input
          type="number"
          inputMode="numeric"
          value={set.r}
          onChange={(e) => onUpdate('r', e.target.value)}
          placeholder="reps"
          className="rt-input"
          style={{ width: '100%', padding: '10px 12px', fontSize: 16, textAlign: 'center', fontWeight: 700 }}
          aria-label={`Répétitions série ${setIdx + 1}`}
        />
      </div>
      <button
        onClick={onToggleDone}
        disabled={!set.w || !set.r}
        className={set.done ? 'rt-btn-success' : 'rt-btn'}
        style={{
          width: 44,
          height: 44,
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: !set.w || !set.r ? 0.4 : 1,
        }}
        aria-label={set.done ? `Décocher série ${setIdx + 1}` : `Marquer série ${setIdx + 1} comme faite`}
        title={set.done ? 'Annuler' : 'Marquer comme faite'}
      >
        <Check size={18} />
      </button>
    </div>
  );
}
