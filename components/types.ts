export type WeightLogEntry = { date: string; weight: number };

export type SetLog = { w: string; r: string; done: boolean };

export type SessionLog = {
  id: number;
  session_id: string;
  date: string;
  exercises: Record<string, SetLog[]>;
  duration_sec: number | null;
};

export type DailyLog = {
  date: string;
  sleep_hours: number | null;
  protein_grams: number | null;
  cardio_minutes: number | null;
  mood: number | null;
  energy: number | null;
  hunger: number | null;
  notes: string | null;
};

export type AppState = {
  startDate: string;
  weightLog: WeightLogEntry[];
  sessionLogs: SessionLog[];
  dailyLogs: DailyLog[];
};

export type TabId =
  | 'overview'
  | 'daily'
  | 'training'
  | 'progression'
  | 'timeline'
  | 'nutrition'
  | 'profile'
  | 'knowledge'
  | 'safety';
