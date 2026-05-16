'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Check, Award, Flag } from 'lucide-react';
import type { Session } from '@/lib/program';
import type { SessionLog, SetLog } from '../types';
import { formatTime, playEndBeep, todayISO } from '@/lib/helpers';
import ExerciseCard from './ExerciseCard';
import FloatingRestTimer from './FloatingRestTimer';
import FinishSessionView from './FinishSessionView';

export default function SessionMode({
  session,
  lastLog,
  soundEnabled,
  onClose,
  onSaved,
}: {
  session: Session;
  lastLog: SessionLog | null;
  soundEnabled: boolean;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  // Build initial logs - pre-fill with values from the last session
  const [logs, setLogs] = useState<Record<string, SetLog[]>>(() => {
    const init: Record<string, SetLog[]> = {};
    session.exercises.forEach((ex) => {
      const prev = lastLog?.exercises?.[ex.id];
      init[ex.id] = Array(ex.sets).fill(null).map((_, i) => {
        const prevSet = prev?.[i];
        return {
          w: prevSet?.w || '',
          r: prevSet?.r || '',
          done: false,
        };
      });
    });
    return init;
  });

  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const [restTotal, setRestTotal] = useState(0);
  const [restLabel, setRestLabel] = useState<string>('');

  const [sessionStartTime] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState(0);

  const [showFinish, setShowFinish] = useState(false);
  const [saving, setSaving] = useState(false);

  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const totalSets = session.exercises.reduce((sum, e) => sum + e.sets, 0);
  const completedSets = Object.values(logs).flat().filter((s) => s.done).length;
  const progressPct = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // Wake lock - keep screen on
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch {}
    })();
    const handler = async () => {
      if (document.visibilityState === 'visible' && active) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch {}
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => {
      active = false;
      document.removeEventListener('visibilitychange', handler);
      try {
        wakeLockRef.current?.release();
      } catch {}
    };
  }, []);

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Rest timer countdown
  useEffect(() => {
    if (restRemaining === null) return;
    if (restRemaining <= 0) {
      if (soundEnabled) playEndBeep();
      setRestRemaining(null);
      return;
    }
    const timeout = setTimeout(() => setRestRemaining((r) => (r === null ? null : r - 1)), 1000);
    return () => clearTimeout(timeout);
  }, [restRemaining, soundEnabled]);

  const updateSet = (exerciseId: string, setIdx: number, field: 'w' | 'r', value: string) => {
    setLogs((prev) => {
      const next = { ...prev };
      next[exerciseId] = [...next[exerciseId]];
      next[exerciseId][setIdx] = { ...next[exerciseId][setIdx], [field]: value };
      return next;
    });
  };

  const toggleSetDone = (exerciseId: string, setIdx: number) => {
    setLogs((prev) => {
      const next = { ...prev };
      next[exerciseId] = [...next[exerciseId]];
      next[exerciseId][setIdx] = {
        ...next[exerciseId][setIdx],
        done: !next[exerciseId][setIdx].done,
      };
      return next;
    });
  };

  const startRest = (durationSec: number, label: string) => {
    setRestTotal(durationSec);
    setRestRemaining(durationSec);
    setRestLabel(label);
  };

  const skipRest = () => setRestRemaining(null);
  const addRest = (s: number) => setRestRemaining((r) => (r === null ? null : Math.max(0, r + s)));

  const finishSession = async () => {
    setSaving(true);
    try {
      await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          date: todayISO(),
          exercises: logs,
          durationSec: sessionTime,
        }),
      });
      await onSaved();
    } finally {
      setSaving(false);
    }
  };

  if (showFinish) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--bg)', overflow: 'auto' }}>
        <div className="rt-grain" />
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setShowFinish(false)}
            className="rt-btn-ghost"
            style={{ padding: '8px 14px', fontSize: 12 }}
          >
            ← Retour
          </button>
        </div>
        <FinishSessionView
          session={session}
          logs={logs}
          sessionTime={sessionTime}
          saving={saving}
          onFinish={finishSession}
          onContinue={() => setShowFinish(false)}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="rt-grain" />

      {/* Sticky header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
          background: 'var(--bg)',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          className="rt-btn-ghost"
          style={{ padding: '8px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <X size={14} /> Quitter
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="rt-muted" style={{ fontSize: 11, fontWeight: 500 }}>Temps</div>
            <div className="rt-mono-num" style={{ fontSize: 15 }}>{formatTime(sessionTime)}</div>
          </div>
          <div style={{ width: 1, height: 28, background: 'var(--border)' }} />
          <div style={{ textAlign: 'center' }}>
            <div className="rt-muted" style={{ fontSize: 11, fontWeight: 500 }}>Séries</div>
            <div className="rt-mono-num rt-accent" style={{ fontSize: 15 }}>
              {completedSets}/{totalSets}
            </div>
          </div>
        </div>

        <div className="rt-accent" style={{ fontSize: 14, fontWeight: 800 }}>
          {session.name}
        </div>
      </div>

      {/* Progress bar under header */}
      <div className="rt-progress-track" style={{ height: 3, borderRadius: 0, flexShrink: 0 }}>
        <div className="rt-progress-fill" style={{ width: `${progressPct}%`, borderRadius: 0 }} />
      </div>

      {/* Scrollable list of exercise cards */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '18px 16px 120px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div className="rt-muted" style={{ fontSize: 13, marginBottom: 4 }}>
            {session.focus} · {session.exercises.length} exercices
          </div>

          {session.exercises.map((exercise, idx) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={idx}
              sets={logs[exercise.id]}
              onUpdateSet={(setIdx, field, value) => updateSet(exercise.id, setIdx, field, value)}
              onToggleDone={(setIdx) => toggleSetDone(exercise.id, setIdx)}
              onStartRest={() => startRest(exercise.rest, exercise.name)}
            />
          ))}

          <button
            onClick={() => setShowFinish(true)}
            className="rt-btn-success"
            style={{
              padding: '18px',
              fontSize: 15,
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Flag size={16} /> Terminer la séance
          </button>
        </div>
      </div>

      {/* Floating rest timer (overlay) */}
      {restRemaining !== null && (
        <FloatingRestTimer
          remaining={restRemaining}
          total={restTotal}
          label={restLabel}
          onSkip={skipRest}
          onAdd={addRest}
        />
      )}
    </div>
  );
}
