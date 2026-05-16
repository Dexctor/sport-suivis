'use client';

import { AlertTriangle, Play } from 'lucide-react';
import { PROGRAM, type Session } from '@/lib/program';
import type { SessionLog } from '../types';
import { formatDate } from '@/lib/helpers';

export default function TrainingTab({
  todaySession,
  setActiveSession,
  sessionLogs,
}: {
  todaySession: Session | null;
  setActiveSession: (s: Session) => void;
  sessionLogs: SessionLog[];
}) {
  const lastFor = (sid: string) => sessionLogs.find((l) => l.session_id === sid) || null;

  return (
    <>
      <div className="rt-section-label" style={{ marginBottom: 18 }}>
        Planning hebdomadaire · Push / Pull / Legs + Upper
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {PROGRAM.sessions.map((session) => {
          const isToday = todaySession?.id === session.id;
          const lastLog = lastFor(session.id);
          const totalSets = session.exercises.reduce((sum, e) => sum + e.sets, 0);
          return (
            <div
              key={session.id}
              className="rt-panel"
              style={{
                padding: 20,
                position: 'relative',
                borderColor: isToday ? 'var(--accent)' : undefined,
                background: isToday ? 'linear-gradient(180deg, rgba(255,69,58,0.05) 0%, transparent 100%)' : undefined,
              }}
            >
              {isToday && (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 14,
                    padding: '4px 10px',
                    background: 'var(--accent)',
                    color: '#000',
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    borderRadius: 4,
                  }}
                >
                  AUJOURD&apos;HUI
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div
                  style={{
                    minWidth: 44,
                    padding: '6px 10px',
                    textAlign: 'center',
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    background: isToday ? 'var(--accent)' : 'var(--bg-2)',
                    color: isToday ? '#000' : 'var(--muted)',
                    borderRadius: 6,
                  }}
                >
                  {session.day}
                </div>
                <div className="rt-muted" style={{ fontSize: 13 }}>≈ {session.duration} min</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{session.name}</div>
              <div className="rt-muted" style={{ fontSize: 13, marginBottom: 12 }}>{session.focus}</div>
              <div className="rt-muted" style={{ fontSize: 12, marginBottom: 16 }}>
                {session.exercises.length} exercices · {totalSets} séries
              </div>
              {lastLog && (
                <div
                  style={{
                    marginBottom: 14,
                    padding: '8px 12px',
                    background: 'var(--bg)',
                    fontSize: 12,
                    borderRadius: 6,
                  }}
                >
                  <span className="rt-muted">Dernière fois&nbsp;: </span>
                  <span className="rt-success" style={{ fontWeight: 600 }}>{formatDate(lastLog.date)}</span>
                </div>
              )}
              <button
                onClick={() => setActiveSession(session)}
                className={isToday ? 'rt-btn-primary' : 'rt-btn'}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Play size={14} fill="currentColor" /> Démarrer
              </button>
            </div>
          );
        })}
      </div>

      <div
        className="rt-panel"
        style={{
          padding: 20,
          marginTop: 28,
          borderColor: 'rgba(251, 191, 36, 0.3)',
          background: 'var(--warning-soft)',
        }}
      >
        <div style={{ display: 'flex', gap: 14 }}>
          <AlertTriangle size={22} className="rt-warning" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }} className="rt-warning">
              Comment progresser en charges
            </div>
            <div style={{ color: '#C8C8C8' }}>
              Si tu boucles toutes les séries dans la fourchette de reps prévue avec 2 reps &laquo;&nbsp;en
              réserve&nbsp;&raquo; sur la dernière série (RPE 7-8) → +2,5&nbsp;kg la séance suivante pour les membres
              supérieurs, ou +5&nbsp;kg pour les jambes. Si tu n&apos;y arrives pas, garde la même charge.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
