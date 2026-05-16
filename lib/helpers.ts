import { PHASES, PROGRAM, type Phase } from './program';

export const todayISO = (): string => new Date().toISOString().split('T')[0];

export const daysBetween = (dateA: string, dateB: string): number => {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

export const formatDateLong = (iso: string): string =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export const getWeekNumber = (startDate: string): number =>
  Math.floor(daysBetween(startDate, todayISO()) / 7) + 1;

export const getCurrentPhase = (week: number): Phase =>
  PHASES.find((p) => week >= p.startWeek && week <= p.endWeek) || PHASES[PHASES.length - 1];

export const getTargetWeightForWeek = (week: number): number => {
  const phase = getCurrentPhase(week);
  const phaseWeeks = phase.endWeek - phase.startWeek;
  if (phaseWeeks === 0) return phase.endWeight;
  const weekInPhase = week - phase.startWeek;
  return phase.startWeight + ((phase.endWeight - phase.startWeight) / phaseWeeks) * weekInPhase;
};

export const formatTime = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

// Returns the ISO Monday for any date string
export const getWeekStartISO = (dateISO: string): string => {
  const d = new Date(dateISO);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Build the last N days as ISO array (oldest first)
export const lastNDays = (n: number): string[] => {
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(d.toISOString().split('T')[0]);
  }
  return result;
};

// Audio beep using Web Audio API
export const playBeep = (frequency = 800, duration = 0.3, volume = 0.3) => {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* silent */
  }
};

export const playEndBeep = () => {
  playBeep(880, 0.15, 0.3);
  setTimeout(() => playBeep(1100, 0.15, 0.3), 180);
  setTimeout(() => playBeep(1320, 0.3, 0.35), 360);
};

export const PROGRAM_REF = PROGRAM;
