'use client';

import { useState } from 'react';
import { Apple, Brain, Dumbbell, Heart, Moon } from 'lucide-react';
import { KNOWLEDGE } from '@/lib/knowledge';

const ICONS: Record<string, typeof Apple> = {
  sleep: Moon,
  nutrition: Apple,
  training: Dumbbell,
  recovery: Heart,
  mindset: Brain,
};

export default function KnowledgeTab() {
  const [openCategory, setOpenCategory] = useState(KNOWLEDGE[0].key);

  return (
    <>
      <div className="rt-section-label" style={{ marginBottom: 18 }}>
        Connaissances · les principes clés
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 8,
          marginBottom: 20,
        }}
      >
        {KNOWLEDGE.map((cat) => {
          const Icon = ICONS[cat.iconName] || Apple;
          return (
            <button
              key={cat.key}
              onClick={() => setOpenCategory(cat.key)}
              className={`rt-tab ${openCategory === cat.key ? 'active' : ''}`}
              style={{
                padding: '12px 14px',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Icon size={15} />
              {cat.title}
            </button>
          );
        })}
      </div>

      {KNOWLEDGE.map((cat) => {
        if (openCategory !== cat.key) return null;
        return (
          <div key={cat.key}>
            <div className="rt-panel-elevated" style={{ padding: 22, marginBottom: 16, borderLeft: '4px solid var(--accent)' }}>
              <div style={{ fontSize: 15, lineHeight: 1.7, color: '#E0E0E0' }}>{cat.intro}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cat.items.map((item, i) => (
                <div key={i} className="rt-panel" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span className="rt-mono-num rt-accent" style={{ fontSize: 13, minWidth: 28, marginTop: 2 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                        {item.title}
                      </div>
                      <div className="rt-muted" style={{ fontSize: 13, lineHeight: 1.65, color: '#C8C8C8' }}>{item.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
