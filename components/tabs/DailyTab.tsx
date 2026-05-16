'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Moon, Apple, Activity, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DailyLog, SessionLog } from '../types';
import { formatDateLong, lastNDays, todayISO } from '@/lib/helpers';
import Slider from '../ui/Slider';
import Heatmap, { type HeatmapValue } from '../ui/Heatmap';

type DraftDaily = {
  date: string;
  sleep_hours: number | null;
  protein_grams: number | null;
  cardio_minutes: number | null;
  mood: number | null;
  energy: number | null;
  hunger: number | null;
  notes: string;
};

const blankDraft = (date: string): DraftDaily => ({
  date,
  sleep_hours: null,
  protein_grams: null,
  cardio_minutes: null,
  mood: null,
  energy: null,
  hunger: null,
  notes: '',
});

export default function DailyTab({
  dailyLogs,
  sessionLogs,
  onChanged,
}: {
  dailyLogs: DailyLog[];
  sessionLogs: SessionLog[];
  onChanged: () => Promise<void>;
}) {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [draft, setDraft] = useState<DraftDaily>(blankDraft(todayISO()));
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const existing = dailyLogs.find((d) => d.date === selectedDate);
    if (existing) {
      setDraft({
        date: selectedDate,
        sleep_hours: existing.sleep_hours,
        protein_grams: existing.protein_grams,
        cardio_minutes: existing.cardio_minutes,
        mood: existing.mood,
        energy: existing.energy,
        hunger: existing.hunger,
        notes: existing.notes || '',
      });
    } else {
      setDraft(blankDraft(selectedDate));
    }
  }, [selectedDate, dailyLogs]);

  useEffect(() => {
    if (draft.date !== selectedDate) return;
    const id = setTimeout(async () => {
      setSaving(true);
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        setSavedAt(Date.now());
        await onChanged();
      }
      setSaving(false);
    }, 600);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const weeklyStats = useMemo(() => {
    const days = lastNDays(7);
    const logs = days.map((d) => dailyLogs.find((dl) => dl.date === d) || null);
    const sum = (sel: (log: DailyLog | null) => number | null) =>
      logs.reduce((acc, l) => acc + (sel(l) || 0), 0);
    const count = (sel: (log: DailyLog | null) => number | null) =>
      logs.filter((l) => sel(l) !== null && sel(l) !== undefined).length;
    return {
      sleep: { total: sum((l) => l?.sleep_hours ?? null), count: count((l) => l?.sleep_hours ?? null) },
      protein: { total: sum((l) => l?.protein_grams ?? null), count: count((l) => l?.protein_grams ?? null) },
      cardio: { total: sum((l) => l?.cardio_minutes ?? null), count: count((l) => l?.cardio_minutes ?? null) },
      mood: { total: sum((l) => l?.mood ?? null), count: count((l) => l?.mood ?? null) },
    };
  }, [dailyLogs]);

  const heatmapSleep: HeatmapValue[] = dailyLogs
    .filter((l) => l.sleep_hours !== null)
    .map((l) => ({ date: l.date, value: Math.min(1, (l.sleep_hours || 0) / 9) }));
  const heatmapProtein: HeatmapValue[] = dailyLogs
    .filter((l) => l.protein_grams !== null)
    .map((l) => ({ date: l.date, value: Math.min(1, (l.protein_grams || 0) / 200) }));
  const heatmapCardio: HeatmapValue[] = dailyLogs
    .filter((l) => l.cardio_minutes !== null)
    .map((l) => ({ date: l.date, value: Math.min(1, (l.cardio_minutes || 0) / 45) }));

  const dateOffset = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    return d.toISOString().split('T')[0];
  };

  const hasSession = sessionLogs.some((s) => s.date === selectedDate);

  return (
    <>
      <div className="rt-section-label" style={{ marginBottom: 18 }}>
        Suivi quotidien · sommeil, nutrition, ressenti
      </div>

      <div
        className="rt-panel"
        style={{
          padding: 16,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="rt-btn-ghost"
            onClick={() => setSelectedDate(dateOffset(-1))}
            style={{ padding: '8px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
            aria-label="Jour précédent"
          >
            <ChevronLeft size={14} /> Précédent
          </button>
          <button
            className="rt-btn-ghost"
            onClick={() => setSelectedDate(todayISO())}
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            Aujourd&apos;hui
          </button>
          <button
            className="rt-btn-ghost"
            onClick={() => setSelectedDate(dateOffset(1))}
            disabled={selectedDate >= todayISO()}
            style={{ padding: '8px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
            aria-label="Jour suivant"
          >
            Suivant <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span className="rt-mono-num rt-accent" style={{ fontSize: 18 }}>{formatDateLong(selectedDate)}</span>
          {saving && <span className="rt-muted" style={{ fontSize: 12 }}>sauvegarde…</span>}
          {!saving && savedAt && Date.now() - savedAt < 2000 && (
            <span className="rt-success" style={{ fontSize: 12, fontWeight: 600 }}>✓ enregistré</span>
          )}
        </div>
      </div>

      {hasSession && (
        <div
          className="rt-panel"
          style={{
            padding: 14,
            marginBottom: 16,
            background: 'var(--success-soft)',
            borderColor: 'rgba(74, 222, 128, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
          }}
        >
          <Check size={16} className="rt-success" />
          <span className="rt-success" style={{ fontWeight: 600 }}>Séance complétée ce jour-là.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginBottom: 20 }}>
        <CategoryCard icon={Moon} title="Sommeil">
          <NumInput
            label="Heures dormies"
            value={draft.sleep_hours}
            onChange={(v) => setDraft({ ...draft, sleep_hours: v })}
            placeholder="7.5"
            step="0.5"
            suffix="h"
          />
          <Hint>Cible&nbsp;: 7 à 9&nbsp;h. En dessous : testostérone ↓, cortisol ↑.</Hint>
        </CategoryCard>

        <CategoryCard icon={Apple} title="Nutrition">
          <NumInput
            label="Protéines (g)"
            value={draft.protein_grams}
            onChange={(v) => setDraft({ ...draft, protein_grams: v })}
            placeholder="180"
            step="5"
            suffix="g"
          />
          <Hint>Cible&nbsp;: 180&nbsp;g et plus. Estime à l&apos;œil après 4&nbsp;semaines de tracking précis.</Hint>
        </CategoryCard>

        <CategoryCard icon={Activity} title="Cardio / marche">
          <NumInput
            label="Minutes"
            value={draft.cardio_minutes}
            onChange={(v) => setDraft({ ...draft, cardio_minutes: v })}
            placeholder="30"
            step="5"
            suffix="min"
          />
          <Hint>Cible&nbsp;: 30&nbsp;minutes et plus par jour (marche, vélo, rameur).</Hint>
        </CategoryCard>
      </div>

      <div className="rt-panel" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <AlertCircle size={16} className="rt-accent" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Ressenti du jour</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          <Slider label="Humeur" value={draft.mood} onChange={(v) => setDraft({ ...draft, mood: v })} unit=" / 10" />
          <Slider label="Énergie" value={draft.energy} onChange={(v) => setDraft({ ...draft, energy: v })} unit=" / 10" />
          <Slider label="Faim" value={draft.hunger} onChange={(v) => setDraft({ ...draft, hunger: v })} unit=" / 10" />
        </div>
        <Hint>
          Détecte tôt les signes de sous-récupération ou de déficit trop agressif (énergie en chute et faim qui
          monte pendant plusieurs jours).
        </Hint>
      </div>

      <div className="rt-panel" style={{ padding: 20, marginBottom: 20 }}>
        <div className="rt-section-label" style={{ marginBottom: 10 }}>Notes du jour</div>
        <textarea
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder="Ex: petite douleur épaule, mauvaise nuit, bon repas…"
          className="rt-input"
          style={{
            width: '100%',
            minHeight: 80,
            padding: 14,
            fontSize: 14,
            lineHeight: 1.6,
            resize: 'vertical',
          }}
        />
      </div>

      <div className="rt-panel" style={{ padding: 22, marginBottom: 20 }}>
        <div className="rt-section-label" style={{ marginBottom: 16 }}>Résumé des 7 derniers jours</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <Avg label="Sommeil" total={weeklyStats.sleep.total} count={weeklyStats.sleep.count} unit="h" target={7} />
          <Avg label="Protéines" total={weeklyStats.protein.total} count={weeklyStats.protein.count} unit="g" target={180} />
          <Avg label="Cardio" total={weeklyStats.cardio.total} count={weeklyStats.cardio.count} unit="min" target={30} />
          <Avg label="Humeur" total={weeklyStats.mood.total} count={weeklyStats.mood.count} unit="/10" target={6} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        <div className="rt-panel" style={{ padding: 20 }}>
          <div className="rt-section-label" style={{ marginBottom: 12 }}>Sommeil · 16 semaines</div>
          <Heatmap values={heatmapSleep} weeks={16} fullColor="#60A5FA" />
        </div>
        <div className="rt-panel" style={{ padding: 20 }}>
          <div className="rt-section-label" style={{ marginBottom: 12 }}>Protéines · 16 semaines</div>
          <Heatmap values={heatmapProtein} weeks={16} fullColor="#FF453A" />
        </div>
        <div className="rt-panel" style={{ padding: 20 }}>
          <div className="rt-section-label" style={{ marginBottom: 12 }}>Cardio · 16 semaines</div>
          <Heatmap values={heatmapCardio} weeks={16} fullColor="#4ADE80" />
        </div>
      </div>
    </>
  );
}

function CategoryCard({ icon: Icon, title, children }: { icon: typeof Moon; title: string; children: React.ReactNode }) {
  return (
    <div className="rt-panel" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
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
        <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rt-muted" style={{ fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function NumInput({
  label, value, onChange, placeholder, step, suffix,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder: string;
  step: string;
  suffix: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value === null ? '' : value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '') onChange(null);
            else {
              const n = parseFloat(v);
              onChange(isNaN(n) ? null : n);
            }
          }}
          placeholder={placeholder}
          className="rt-input"
          style={{ flex: 1, padding: '12px 14px', fontSize: 20, textAlign: 'center', fontWeight: 700 }}
        />
        <span className="rt-muted" style={{ fontSize: 14, minWidth: 30 }}>{suffix}</span>
      </div>
    </div>
  );
}

function Avg({
  label, total, count, unit, target,
}: {
  label: string; total: number; count: number; unit: string; target: number;
}) {
  const avg = count > 0 ? total / count : 0;
  const ok = count > 0 && avg >= target;
  return (
    <div>
      <div className="rt-muted" style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className={`rt-mono-num ${count === 0 ? 'rt-muted' : ok ? 'rt-success' : 'rt-warning'}`} style={{ fontSize: 24 }}>
          {count > 0 ? avg.toFixed(1) : '—'}
        </span>
        <span className="rt-muted" style={{ fontSize: 13 }}>{unit}</span>
      </div>
      <div className="rt-muted" style={{ fontSize: 11, marginTop: 4 }}>
        {count} / 7 jour{count > 1 ? 's' : ''} renseigné{count > 1 ? 's' : ''}
      </div>
    </div>
  );
}
