'use client';

import { AlertTriangle, X } from 'lucide-react';
import { PROGRAM } from '@/lib/program';

export default function SafetyTab() {
  return (
    <>
      <div className="rt-section-label" style={{ marginBottom: 18 }}>
        Contraintes médicales personnelles
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginBottom: 28 }}>
        <div className="rt-panel" style={{ padding: 22, borderColor: 'rgba(255, 69, 58, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 6, height: 28, background: 'var(--accent)', borderRadius: 3 }} />
            <span style={{ fontSize: 16, fontWeight: 800 }}>Colonne vertébrale</span>
          </div>
          <div style={{ fontSize: 14, marginBottom: 10, fontWeight: 500 }}>Compression L5-S1</div>
          <div className="rt-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
            Zéro charge axiale lourde sur la colonne. Privilégier machines, hip thrust, presse, hack squat.
          </div>
        </div>
        <div className="rt-panel" style={{ padding: 22, borderColor: 'rgba(255, 69, 58, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 6, height: 28, background: 'var(--accent)', borderRadius: 3 }} />
            <span style={{ fontSize: 16, fontWeight: 800 }}>Épaule gauche</span>
          </div>
          <div style={{ fontSize: 14, marginBottom: 10, fontWeight: 500 }}>Hill-Sachs + labrum antérieur</div>
          <div className="rt-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
            Éviter abduction + rotation externe (position de lancer). Prises neutres autant que possible.
          </div>
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>Exercices interdits</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROGRAM.forbidden.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 14px',
                background: 'var(--bg)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: 4,
              }}
            >
              <X size={16} className="rt-accent" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{item.name}</div>
                <div className="rt-muted" style={{ fontSize: 12, marginTop: 4 }}>
                  Raison&nbsp;: {item.reason}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>
          Signaux d&apos;alerte · arrêt immédiat
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Douleur aiguë (≠ inconfort musculaire normal) dans le bas du dos',
            "Sensation d'instabilité ou de « décrochage » dans l'épaule gauche",
            'Picotement ou engourdissement dans une jambe ou un bras pendant un exercice',
            'Crack/claquement sec articulaire suivi de douleur',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.6 }}>
              <AlertTriangle size={16} className="rt-warning" style={{ flexShrink: 0, marginTop: 3 }} />
              <span>{t}</span>
            </div>
          ))}
        </div>
        <div className="rt-muted" style={{ fontSize: 13, marginTop: 18, lineHeight: 1.6, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          En cas de doute → consultation kiné. Un exercice mal toléré peut TOUJOURS être remplacé par une variante
          machine. La progression sur 11 mois est plus importante qu&apos;une séance &laquo;&nbsp;parfaite&nbsp;&raquo;.
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>Checklist avant chaque séance</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Échauffement articulaire général : 5 min vélo + rotations épaules + cat-cow pour le dos',
            'Échauffement spécifique : 2 séries légères du premier exercice avant les séries lourdes',
            'Activation des fessiers avant Lower : 1 série de 15 reps de hip thrust à vide',
            'Activation rotateurs avant Upper : 1 série de 15 face pull poulie basse',
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.6 }}>
              <div className="rt-mono-num rt-accent" style={{ minWidth: 26, fontSize: 13, marginTop: 2 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
