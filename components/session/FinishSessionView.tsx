'use client';

import { Award, Check } from 'lucide-react';
import type { Session } from '@/lib/program';
import type { SetLog } from '../types';
import { formatTime } from '@/lib/helpers';

export default function FinishSessionView({
  session,
  logs,
  sessionTime,
  saving,
  onFinish,
  onContinue,
}: {
  session: Session;
  logs: Record<string, SetLog[]>;
  sessionTime: number;
  saving: boolean;
  onFinish: () => void;
  onContinue: () => void;
}) {
  const totalSets = Object.values(logs).flat().filter((s) => s.done).length;
  const totalVolume = Object.values(logs).reduce((sum, sets) => {
    return (
      sum +
      sets.reduce((s, set) => (set.done ? s + (parseFloat(set.w) || 0) * (parseFloat(set.r) || 0) : s), 0)
    );
  }, 0);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        maxWidth: 540,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Award size={52} className="rt-success" style={{ marginBottom: 16 }} />
      <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 10 }}>Séance terminée !</div>
      <div className="rt-muted" style={{ fontSize: 14, marginBottom: 32, textAlign: 'center' }}>
        {session.name} · {session.focus}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%', marginBottom: 32 }}>
        <Card label="Durée" value={formatTime(sessionTime)} />
        <Card label="Séries" value={totalSets} accent />
        <Card label="Volume" value={`${Math.round(totalVolume)} kg`} />
      </div>

      <button
        onClick={onFinish}
        disabled={saving}
        className="rt-btn-success"
        style={{
          width: '100%',
          padding: 18,
          fontSize: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Check size={18} /> {saving ? 'Sauvegarde…' : 'Enregistrer et fermer'}
      </button>
      <button
        onClick={onContinue}
        disabled={saving}
        className="rt-btn-ghost"
        style={{ padding: 12, fontSize: 13 }}
      >
        Retourner aux exercices
      </button>
    </div>
  );
}

function Card({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rt-panel" style={{ padding: 16, textAlign: 'center' }}>
      <div className="rt-muted" style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div className={`rt-mono-num ${accent ? 'rt-accent' : ''}`} style={{ fontSize: 22 }}>
        {value}
      </div>
    </div>
  );
}
