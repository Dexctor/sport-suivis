'use client';

import { Clock, Flame, Heart, Target, TrendingDown } from 'lucide-react';
import { PROGRAM, type Phase } from '@/lib/program';
import InfoBlock from '../ui/InfoBlock';

export default function NutritionTab({ phase }: { phase: Phase }) {
  const isMaintenance = phase.type === 'maintenance';
  const currentCalories = isMaintenance ? PROGRAM.diet.refeedCalories : PROGRAM.diet.cutCalories;

  return (
    <>
      <div className="rt-section-label" style={{ marginBottom: 18 }}>
        Cibles nutritionnelles · Phase {phase.num} ({isMaintenance ? 'Maintenance' : 'Déficit'})
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <MacroCard label="Calories" value={currentCalories} unit="kcal" main accent={isMaintenance} />
        <MacroCard label="Protéines" value={PROGRAM.diet.protein} unit="g" sub="priorité #1" />
        <MacroCard label="Lipides" value={PROGRAM.diet.fats} unit="g" sub="min 0,8 g/kg" />
        <MacroCard
          label="Glucides"
          value={isMaintenance ? PROGRAM.diet.carbs + 100 : PROGRAM.diet.carbs}
          unit="g"
          sub="à ajuster selon l'énergie"
        />
      </div>

      {isMaintenance && (
        <div className="rt-panel" style={{ padding: 18, marginBottom: 18, borderColor: 'rgba(74, 222, 128, 0.3)', background: 'var(--success-soft)' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <Heart size={22} className="rt-success" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }} className="rt-success">
                Phase de maintenance — la science
              </div>
              <div style={{ color: '#C8C8C8' }}>
                Ces 2 semaines à maintenance ne sont PAS un cheat. Elles restaurent la leptine (hormone de satiété),
                la T3 (thyroïde), la testostérone, et préviennent l&apos;adaptation métabolique. Tu vas reprendre 1
                à 2 kg d&apos;eau et glycogène, c&apos;est normal et même souhaité. Le déficit suivant sera plus
                efficace.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>
          Sources protéiques · budget 200 € / mois
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {PROGRAM.diet_foods.map((food, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderBottom: i < PROGRAM.diet_foods.length - 1 ? '1px dashed var(--border)' : 'none',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{food.name}</div>
                <div className="rt-muted" style={{ fontSize: 12, marginTop: 4 }}>{food.macros}</div>
              </div>
              <div className="rt-accent" style={{ fontSize: 14, fontWeight: 700 }}>{food.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 18 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>
          Journée type à {currentCalories} kcal
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <MealRow time="07h30" name="Petit-déj" items="100 g flocons d'avoine · 1 scoop whey · 1 banane · 30 g amandes" macros="~650 kcal · 45 g prot" />
          <MealRow time="12h30" name="Déjeuner" items="200 g blanc de poulet · 150 g riz cuit · 200 g légumes verts · 15 g huile d'olive" macros="~720 kcal · 55 g prot" />
          <MealRow time="16h00" name="Collation" items="250 g fromage blanc 0% · 2 œufs durs · 1 fruit" macros="~340 kcal · 38 g prot" />
          <MealRow
            time="19h30"
            name="Dîner"
            items={isMaintenance ? "200 g cabillaud · 250 g patates douces · salade · 15 g huile" : "180 g cabillaud ou thon · 200 g patates douces · salade · 10 g huile"}
            macros={isMaintenance ? '~720 kcal · 50 g prot' : '~570 kcal · 45 g prot'}
          />
          <MealRow time="22h30" name="Caséine" items="200 g skyr nature · 1 c.s. beurre de cacahuète" macros="~250 kcal · 25 g prot · maintien MPS nocturne" />
        </div>
        <div
          style={{
            marginTop: 18,
            paddingTop: 18,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 13,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span className="rt-muted">Total estimé</span>
          <span>
            <span className="rt-accent rt-mono-num">~{currentCalories} kcal</span> ·{' '}
            <span className="rt-mono-num">~213 g</span> protéines
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <InfoBlock
          icon={Flame}
          title="Le levier #1"
          text="C'est la diète, pas la muscu. Sans déficit, les abdos restent cachés peu importe le volume soulevé. Les 80% du résultat se jouent ici."
        />
        <InfoBlock
          icon={Target}
          title="Hydratation"
          text="3 à 4 litres d'eau par jour. 500 ml dès le réveil. Aide à la satiété, à la récup, et à la synthèse protéique."
        />
        <InfoBlock
          icon={TrendingDown}
          title="Déficit modéré"
          text="500 kcal sous la maintenance = environ 0,5 kg par semaine. Plus agressif → perte musculaire. La patience paie."
        />
        <InfoBlock
          icon={Clock}
          title="Timing secondaire"
          text="L'idée de fenêtre anabolique 30 min post-séance est dépassée. Le total quotidien et la régularité priment."
        />
      </div>
    </>
  );
}

function MacroCard({
  label, value, unit, sub, main, accent,
}: {
  label: string; value: number; unit: string; sub?: string; main?: boolean; accent?: boolean;
}) {
  return (
    <div
      className={main ? 'rt-panel-elevated' : 'rt-panel'}
      style={{ padding: 16, borderColor: accent && main ? 'var(--success)' : undefined }}
    >
      <div className="rt-muted" style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span
          className={`rt-mono-num ${main ? (accent ? 'rt-success' : 'rt-accent') : ''}`}
          style={{ fontSize: main ? 30 : 24 }}
        >
          {value}
        </span>
        <span className="rt-muted" style={{ fontSize: 13 }}>{unit}</span>
      </div>
      {sub && <div className="rt-muted" style={{ fontSize: 12, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function MealRow({ time, name, items, macros }: { time: string; name: string; items: string; macros: string }) {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ minWidth: 70 }}>
        <div className="rt-accent rt-mono-num" style={{ fontSize: 15 }}>{time}</div>
        <div className="rt-muted" style={{ fontSize: 11, marginTop: 4, letterSpacing: '0.04em', fontWeight: 600 }}>
          {name.toUpperCase()}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{items}</div>
        <div className="rt-muted" style={{ fontSize: 12, marginTop: 6 }}>{macros}</div>
      </div>
    </div>
  );
}
