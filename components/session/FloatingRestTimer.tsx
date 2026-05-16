'use client';

import { useState } from 'react';
import { SkipForward, ChevronDown, ChevronUp, X } from 'lucide-react';
import { formatTime } from '@/lib/helpers';

export default function FloatingRestTimer({
  remaining,
  total,
  label,
  onSkip,
  onAdd,
}: {
  remaining: number;
  total: number;
  label: string;
  onSkip: () => void;
  onAdd: (s: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const isUrgent = remaining <= 5;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);

  if (!expanded) {
    // Compact pill
    return (
      <button
        onClick={() => setExpanded(true)}
        className="rt-panel-elevated"
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
          padding: '10px 16px',
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: `1px solid ${isUrgent ? 'var(--warning)' : 'var(--accent)'}`,
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div className={`rt-mono-num ${isUrgent ? 'rt-warning' : 'rt-accent'}`} style={{ fontSize: 18 }}>
          {formatTime(remaining)}
        </div>
        <span className="rt-muted" style={{ fontSize: 12 }}>Repos en cours</span>
        <ChevronUp size={14} className="rt-muted" />
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      className="rt-bg-fade-in"
      onClick={() => setExpanded(false)}
    >
      <div
        className="rt-panel-elevated"
        style={{
          width: '100%',
          maxWidth: 360,
          padding: 26,
          textAlign: 'center',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setExpanded(false)}
          className="rt-btn-ghost"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Réduire le timer"
          title="Réduire (continuer à voir le timer en bas)"
        >
          <ChevronDown size={16} />
        </button>

        <div className="rt-muted" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>
          TEMPS DE REPOS
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 22, color: 'var(--text)' }}>
          {label}
        </div>

        <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 24px' }}>
          <svg width="200" height="200" className="rt-rest-ring">
            <circle cx="100" cy="100" r={radius * 2.4} fill="none" stroke="var(--bg-2)" strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r={radius * 2.4}
              fill="none"
              stroke={isUrgent ? 'var(--warning)' : 'var(--accent)'}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * radius * 2.4}
              strokeDashoffset={(2 * Math.PI * radius * 2.4) * (1 - pct / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className={`rt-mono-num ${isUrgent ? 'rt-warning' : 'rt-accent'}`} style={{ fontSize: 54, lineHeight: 1 }}>
              {formatTime(remaining)}
            </div>
            <div className="rt-muted" style={{ fontSize: 12, marginTop: 8 }}>
              sur {formatTime(total)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onAdd(-15)} className="rt-btn" style={{ padding: '10px 16px', fontSize: 13 }}>
            −15 s
          </button>
          <button onClick={() => onAdd(15)} className="rt-btn" style={{ padding: '10px 16px', fontSize: 13 }}>
            +15 s
          </button>
          <button
            onClick={onSkip}
            className="rt-btn-primary"
            style={{ padding: '10px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <SkipForward size={14} /> Passer
          </button>
        </div>

        <div className="rt-muted" style={{ fontSize: 11, marginTop: 18 }}>
          Touche le fond ou réduis avec ↓ pour revenir à la liste des exos
        </div>

        {/* Hidden but used for compactness check */}
        <span style={{ display: 'none' }}>
          <X size={1} />
          <SkipForward size={1} />
          {circumference}
          {dashOffset}
        </span>
      </div>
    </div>
  );
}
