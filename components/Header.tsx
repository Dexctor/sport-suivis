'use client';

import { Volume2, VolumeX } from 'lucide-react';
import type { Phase } from '@/lib/program';
import { PROGRAM } from '@/lib/program';

export default function Header({
  dayNumber,
  daysRemaining,
  phase,
  soundEnabled,
  toggleSound,
}: {
  dayNumber: number;
  daysRemaining: number;
  phase: Phase;
  soundEnabled: boolean;
  toggleSound: () => void;
}) {
  return (
    <header style={{ marginBottom: 28 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 12,
              padding: '6px 12px',
              background: phase.type === 'cut' ? 'rgba(255, 69, 58, 0.12)' : 'rgba(74, 222, 128, 0.12)',
              border: `1px solid ${phase.type === 'cut' ? 'rgba(255, 69, 58, 0.3)' : 'rgba(74, 222, 128, 0.3)'}`,
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: phase.type === 'cut' ? '#FF453A' : '#4ADE80',
              }}
              className="rt-pulse"
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: phase.type === 'cut' ? '#FF453A' : '#4ADE80',
              }}
            >
              Phase {phase.num} · {phase.name}
            </span>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Recomp <span className="rt-accent">Lean</span>
          </h1>
          <div className="rt-muted" style={{ fontSize: 14, marginTop: 8 }}>
            Objectif&nbsp;: {PROGRAM.targetWeight} kg à ~{PROGRAM.targetBF}% de masse grasse · sur {PROGRAM.totalWeeks} semaines
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={toggleSound}
            className="rt-btn-ghost"
            style={{
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
            }}
            title={soundEnabled ? 'Couper le son' : 'Activer le son'}
            aria-label={soundEnabled ? 'Couper le son' : 'Activer le son'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <div style={{ textAlign: 'right' }}>
            <div className="rt-mono-num rt-accent" style={{ fontSize: 34, lineHeight: 1 }}>
              J{dayNumber}
            </div>
            <div className="rt-muted" style={{ fontSize: 13, marginTop: 6 }}>
              encore {daysRemaining} jours
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
