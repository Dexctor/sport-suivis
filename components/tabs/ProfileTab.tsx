'use client';

import { useEffect, useState } from 'react';
import { User, Calculator, Flame, Target } from 'lucide-react';
import { ACTIVITY_LEVELS, bmr, macros, tdee, type Sex } from '@/lib/tdee';

type ProfileData = {
  height_cm: number | null;
  age: number | null;
  sex: Sex | null;
  activity_level: number | null;
  deficit_pct: number | null;
};

const DEFAULT_PROFILE: ProfileData = {
  height_cm: 184,
  age: 30,
  sex: 'M',
  activity_level: 1.55,
  deficit_pct: 20,
};

export default function ProfileTab({ currentWeight }: { currentWeight: number }) {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile({
            height_cm: data.height_cm ?? DEFAULT_PROFILE.height_cm,
            age: data.age ?? DEFAULT_PROFILE.age,
            sex: data.sex ?? DEFAULT_PROFILE.sex,
            activity_level: data.activity_level ?? DEFAULT_PROFILE.activity_level,
            deficit_pct: data.deficit_pct ?? DEFAULT_PROFILE.deficit_pct,
          });
        }
      } catch {} finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const id = setTimeout(async () => {
      setSaving(true);
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) setSavedAt(Date.now());
      setSaving(false);
    }, 600);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const isComplete =
    profile.height_cm !== null &&
    profile.age !== null &&
    profile.sex !== null &&
    profile.activity_level !== null &&
    profile.deficit_pct !== null;

  const computed = isComplete
    ? (() => {
        const b = bmr(currentWeight, profile.height_cm!, profile.age!, profile.sex!);
        const maintenance = tdee(currentWeight, profile.height_cm!, profile.age!, profile.sex!, profile.activity_level!);
        const cut = Math.round(maintenance * (1 - profile.deficit_pct! / 100));
        return {
          bmr: b,
          maintenance,
          cut,
          refeed: maintenance,
          deficitKcal: maintenance - cut,
          cutMacros: macros(cut, currentWeight),
          maintenanceMacros: macros(maintenance, currentWeight),
        };
      })()
    : null;

  return (
    <>
      <div
        className="rt-section-label"
        style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}
      >
        <span>Profil · calculateur TDEE personnalisé</span>
        {saving && <span style={{ fontWeight: 400 }}>Sauvegarde…</span>}
        {!saving && savedAt && Date.now() - savedAt < 2000 && (
          <span className="rt-success" style={{ fontWeight: 600 }}>✓ Enregistré</span>
        )}
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <SectionHeader icon={User} title="Données personnelles" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          <Field label="Poids actuel" hint="(mis à jour via l'onglet Aperçu)">
            <ReadOnlyInput value={`${currentWeight.toFixed(1)} kg`} />
          </Field>

          <Field label="Taille">
            <NumInput
              value={profile.height_cm}
              onChange={(v) => setProfile({ ...profile, height_cm: v })}
              placeholder="184"
              suffix="cm"
            />
          </Field>

          <Field label="Âge">
            <NumInput
              value={profile.age}
              onChange={(v) => setProfile({ ...profile, age: v })}
              placeholder="30"
              suffix="ans"
            />
          </Field>

          <Field label="Sexe">
            <div style={{ display: 'flex', gap: 8 }}>
              {(['M', 'F'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setProfile({ ...profile, sex: s })}
                  className={profile.sex === s ? 'rt-btn-primary' : 'rt-btn'}
                  style={{ flex: 1, padding: '12px', fontSize: 16, fontWeight: 800 }}
                >
                  {s === 'M' ? 'Homme' : 'Femme'}
                </button>
              ))}
            </div>
          </Field>
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <SectionHeader icon={Flame} title="Niveau d'activité" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ACTIVITY_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => setProfile({ ...profile, activity_level: level.value })}
              className={profile.activity_level === level.value ? 'rt-btn-primary' : 'rt-btn'}
              style={{
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 14,
                textAlign: 'left',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, marginBottom: 4, fontSize: 15 }}>{level.label}</div>
                <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 400 }}>{level.desc}</div>
              </div>
              <div className="rt-mono-num" style={{ fontSize: 16 }}>×{level.value}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <SectionHeader icon={Target} title="Déficit calorique en cut" />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
          <span className="rt-mono-num rt-accent" style={{ fontSize: 32 }}>
            −{profile.deficit_pct ?? 20}
          </span>
          <span className="rt-muted" style={{ fontSize: 14 }}>% sous la maintenance</span>
        </div>

        <input
          type="range"
          min={10}
          max={30}
          step={5}
          value={profile.deficit_pct ?? 20}
          onChange={(e) => setProfile({ ...profile, deficit_pct: Number(e.target.value) })}
          style={{ width: '100%', accentColor: '#FF453A', height: 28 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span className="rt-muted" style={{ fontSize: 11 }}>−10% (lent)</span>
          <span className="rt-muted" style={{ fontSize: 11 }}>−20% (recommandé)</span>
          <span className="rt-muted" style={{ fontSize: 11 }}>−30% (agressif)</span>
        </div>
        <div className="rt-muted" style={{ fontSize: 13, marginTop: 14, lineHeight: 1.6 }}>
          Au-delà de −25%, risque accru de perte musculaire et chute hormonale. −20% est le sweet spot pour 0,5 à 0,7
          kg / semaine.
        </div>
      </div>

      {computed && (
        <>
          <div className="rt-panel-elevated" style={{ padding: 22, marginBottom: 18, borderLeft: '4px solid var(--accent)' }}>
            <SectionHeader icon={Calculator} title="Tes cibles caloriques" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 14 }}>
              <Stat label="BMR" value={computed.bmr} unit="kcal" sub="métabolisme de base (repos total)" />
              <Stat label="Maintenance" value={computed.maintenance} unit="kcal" sub="poids stable" />
              <Stat label="Cut" value={computed.cut} unit="kcal" accent sub={`−${computed.deficitKcal} kcal`} />
              <Stat label="Refeed" value={computed.refeed} unit="kcal" sub="phases maintenance" />
            </div>
            <div className="rt-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Calculé via la formule Mifflin-St Jeor (la plus précise pour les non-athlètes). Recalculé
              automatiquement à chaque pesée.
            </div>
          </div>

          <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
            <div className="rt-section-label" style={{ marginBottom: 16 }}>
              Répartition macros · Cut ({computed.cut} kcal)
            </div>
            <MacroRow label="Protéines" g={computed.cutMacros.protein_g} kcal={computed.cutMacros.protein_g * 4} pct={Math.round((computed.cutMacros.protein_g * 4 / computed.cut) * 100)} color="#FF453A" />
            <MacroRow label="Lipides" g={computed.cutMacros.fats_g} kcal={computed.cutMacros.fats_g * 9} pct={Math.round((computed.cutMacros.fats_g * 9 / computed.cut) * 100)} color="#FBBF24" />
            <MacroRow label="Glucides" g={computed.cutMacros.carbs_g} kcal={computed.cutMacros.carbs_g * 4} pct={Math.round((computed.cutMacros.carbs_g * 4 / computed.cut) * 100)} color="#4ADE80" />
            <div className="rt-muted" style={{ fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
              Protéines&nbsp;: 2,0 g/kg pour préserver le muscle en déficit · Lipides&nbsp;: 0,9 g/kg minimum pour la
              testostérone · Glucides&nbsp;: le reste pour l&apos;énergie d&apos;entraînement.
            </div>
          </div>

          <div className="rt-panel" style={{ padding: 22 }}>
            <div className="rt-section-label" style={{ marginBottom: 16 }}>
              Répartition macros · Maintenance ({computed.maintenance} kcal)
            </div>
            <MacroRow label="Protéines" g={computed.maintenanceMacros.protein_g} kcal={computed.maintenanceMacros.protein_g * 4} pct={Math.round((computed.maintenanceMacros.protein_g * 4 / computed.maintenance) * 100)} color="#FF453A" />
            <MacroRow label="Lipides" g={computed.maintenanceMacros.fats_g} kcal={computed.maintenanceMacros.fats_g * 9} pct={Math.round((computed.maintenanceMacros.fats_g * 9 / computed.maintenance) * 100)} color="#FBBF24" />
            <MacroRow label="Glucides" g={computed.maintenanceMacros.carbs_g} kcal={computed.maintenanceMacros.carbs_g * 4} pct={Math.round((computed.maintenanceMacros.carbs_g * 4 / computed.maintenance) * 100)} color="#4ADE80" />
          </div>
        </>
      )}

      {!isComplete && (
        <div className="rt-panel" style={{ padding: 18, borderColor: 'rgba(251, 191, 36, 0.3)', background: 'var(--warning-soft)' }}>
          <div className="rt-warning" style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
            Complète tes données
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: '#C8C8C8' }}>
            Renseigne taille, âge, sexe, niveau d&apos;activité et déficit pour calculer tes besoins caloriques.
          </div>
        </div>
      )}
    </>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
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
        <Icon size={16} className="rt-accent" />
      </div>
      <span style={{ fontSize: 15, fontWeight: 700 }}>{title}</span>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      {children}
      {hint && <div className="rt-muted" style={{ fontSize: 11, marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

function NumInput({
  value, onChange, placeholder, suffix,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder: string;
  suffix: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        placeholder={placeholder}
        className="rt-input"
        style={{ flex: 1, padding: '12px 14px', fontSize: 18, textAlign: 'center', fontWeight: 700 }}
      />
      <span className="rt-muted" style={{ fontSize: 13, minWidth: 28 }}>{suffix}</span>
    </div>
  );
}

function ReadOnlyInput({ value }: { value: string }) {
  return (
    <div
      className="rt-input"
      style={{
        padding: '12px 14px',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 700,
        opacity: 0.7,
        background: 'var(--bg-2)',
      }}
    >
      {value}
    </div>
  );
}

function Stat({ label, value, unit, sub, accent }: { label: string; value: number; unit: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rt-panel" style={{ padding: 14 }}>
      <div className="rt-muted" style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className={`rt-mono-num ${accent ? 'rt-accent' : ''}`} style={{ fontSize: 22 }}>{value}</span>
        <span className="rt-muted" style={{ fontSize: 12 }}>{unit}</span>
      </div>
      {sub && <div className="rt-muted" style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

function MacroRow({ label, g, kcal, pct, color }: { label: string; g: number; kcal: number; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
        <span className="rt-mono-num" style={{ fontSize: 13 }}>
          {g} g <span className="rt-muted" style={{ fontWeight: 400 }}>· {kcal} kcal · {pct}%</span>
        </span>
      </div>
      <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}
