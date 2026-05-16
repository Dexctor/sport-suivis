'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, Apple, BarChart3, BookOpen, Calendar, Dumbbell, LineChart, Shield, TrendingUp, User,
} from 'lucide-react';
import type { AppState, SessionLog, TabId } from './types';
import type { Session } from '@/lib/program';
import { PROGRAM } from '@/lib/program';
import {
  daysBetween, getCurrentPhase, getTargetWeightForWeek, getWeekNumber, todayISO,
} from '@/lib/helpers';
import Header from './Header';
import OverviewTab from './tabs/OverviewTab';
import DailyTab from './tabs/DailyTab';
import TrainingTab from './tabs/TrainingTab';
import ProgressionTab from './tabs/ProgressionTab';
import TimelineTab from './tabs/TimelineTab';
import NutritionTab from './tabs/NutritionTab';
import ProfileTab from './tabs/ProfileTab';
import KnowledgeTab from './tabs/KnowledgeTab';
import SafetyTab from './tabs/SafetyTab';
import SessionMode from './session/SessionMode';

const STORAGE_TAB_KEY = 'recomp:lastTab';
const STORAGE_SOUND_KEY = 'recomp:soundEnabled';

const FALLBACK_STATE: AppState = {
  startDate: todayISO(),
  weightLog: [],
  sessionLogs: [],
  dailyLogs: [],
};

export default function Tracker({ initial }: { initial: AppState | null }) {
  const [state, setState] = useState<AppState>(initial || FALLBACK_STATE);
  const [tab, setTab] = useState<TabId>('overview');
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Restore tab + sound preference on mount
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_TAB_KEY) as TabId | null;
      if (t) setTab(t);
      const s = localStorage.getItem(STORAGE_SOUND_KEY);
      if (s !== null) setSoundEnabled(s === '1');
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_TAB_KEY, tab); } catch {}
  }, [tab]);

  const toggleSound = () => {
    setSoundEnabled((v) => {
      try { localStorage.setItem(STORAGE_SOUND_KEY, !v ? '1' : '0'); } catch {}
      return !v;
    });
  };

  const refreshState = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setState(data);
      }
    } catch {} finally {
      setRefreshing(false);
    }
  };

  // Computed state shared by tabs
  const week = getWeekNumber(state.startDate);
  const phase = getCurrentPhase(week);
  const dayNumber = daysBetween(state.startDate, todayISO()) + 1;
  const daysRemaining = Math.max(0, PROGRAM.totalWeeks * 7 - dayNumber);
  const currentWeight = state.weightLog.length > 0
    ? state.weightLog[state.weightLog.length - 1].weight
    : PROGRAM.startWeight;
  const targetThisWeek = getTargetWeightForWeek(week);
  const progressPct = Math.max(
    0,
    Math.min(100, ((PROGRAM.startWeight - currentWeight) / (PROGRAM.startWeight - PROGRAM.targetWeight)) * 100),
  );

  const todayDayCode = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'][new Date().getDay()];
  const todaySession = PROGRAM.sessions.find((s) => s.day === todayDayCode) || null;

  const sessionsThisWeek = useMemo(() => {
    const monday = new Date();
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    const cutoff = monday.toISOString().split('T')[0];
    return state.sessionLogs.filter((s) => s.date >= cutoff).length;
  }, [state.sessionLogs]);

  const lastSessionLogFor = (sessionId: string): SessionLog | null => {
    const matches = state.sessionLogs.filter((l) => l.session_id === sessionId);
    return matches.length > 0 ? matches[0] : null;
  };

  const onSessionSaved = async () => {
    setActiveSession(null);
    await refreshState();
  };

  if (activeSession) {
    return (
      <SessionMode
        session={activeSession}
        lastLog={lastSessionLogFor(activeSession.id)}
        soundEnabled={soundEnabled}
        onClose={() => setActiveSession(null)}
        onSaved={onSessionSaved}
      />
    );
  }

  const tabs: Array<{ id: TabId; label: string; icon: React.ComponentType<{ size?: number }> }> = [
    { id: 'overview', label: 'Aperçu', icon: Activity },
    { id: 'daily', label: 'Jour', icon: Calendar },
    { id: 'training', label: 'Séances', icon: Dumbbell },
    { id: 'progression', label: 'Charges', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline', icon: BarChart3 },
    { id: 'nutrition', label: 'Nutrition', icon: Apple },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'knowledge', label: 'Savoir', icon: BookOpen },
    { id: 'safety', label: 'Sécurité', icon: Shield },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="rt-grain" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px 100px', position: 'relative', zIndex: 2 }}>
        <Header
          dayNumber={dayNumber}
          daysRemaining={daysRemaining}
          phase={phase}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />

        <nav
          className="rt-tab-strip"
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 24,
            overflowX: 'auto',
            paddingBottom: 6,
            margin: '0 -16px 24px',
            padding: '0 16px 6px',
          }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rt-tab ${tab === id ? 'active' : ''}`}
              style={{
                padding: '10px 14px',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {tab === 'overview' && (
          <OverviewTab
            state={state}
            currentWeight={currentWeight}
            progressPct={progressPct}
            phase={phase}
            week={week}
            targetThisWeek={targetThisWeek}
            sessionsThisWeek={sessionsThisWeek}
            todaySession={todaySession}
            setActiveSession={setActiveSession}
            setTab={setTab}
            onWeightLogged={refreshState}
          />
        )}
        {tab === 'daily' && (
          <DailyTab dailyLogs={state.dailyLogs} sessionLogs={state.sessionLogs} onChanged={refreshState} />
        )}
        {tab === 'training' && (
          <TrainingTab
            todaySession={todaySession}
            setActiveSession={setActiveSession}
            sessionLogs={state.sessionLogs}
          />
        )}
        {tab === 'progression' && (
          <ProgressionTab sessionLogs={state.sessionLogs} />
        )}
        {tab === 'timeline' && <TimelineTab week={week} />}
        {tab === 'nutrition' && <NutritionTab phase={phase} />}
        {tab === 'profile' && <ProfileTab currentWeight={currentWeight} />}
        {tab === 'knowledge' && <KnowledgeTab />}
        {tab === 'safety' && <SafetyTab />}

        <footer
          style={{
            marginTop: 72,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div className="rt-muted" style={{ fontSize: 12 }}>
            Recomp Lean · v3.0
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <a
              href="/api/export"
              className="rt-link-btn"
              style={{ textDecoration: 'none' }}
              download
            >
              ↓ Exporter mes données
            </a>
            <button
              onClick={async () => {
                if (!confirm('Te déconnecter ?')) return;
                await fetch('/api/auth/logout', { method: 'POST' });
                location.href = '/login';
              }}
              className="rt-link-btn"
            >
              Se déconnecter
            </button>
            {refreshing && <span className="rt-muted" style={{ fontSize: 12 }}>Sync…</span>}
          </div>
        </footer>
      </div>
    </div>
  );
}
