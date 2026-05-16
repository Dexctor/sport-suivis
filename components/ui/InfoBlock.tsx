'use client';

import type { LucideIcon } from 'lucide-react';

export default function InfoBlock({
  icon: Icon, title, text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rt-panel" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={18} className="rt-accent" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
      </div>
      <div className="rt-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}
