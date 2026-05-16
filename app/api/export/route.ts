import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const [meta, weights, sessions, daily, sets] = await Promise.all([
    sql`SELECT key, value FROM app_meta;`,
    sql`SELECT to_char(date, 'YYYY-MM-DD') AS date, weight_kg::float AS weight_kg FROM weights ORDER BY date ASC;`,
    sql`SELECT id, session_id, to_char(date, 'YYYY-MM-DD') AS date, exercises, duration_sec FROM session_logs ORDER BY date ASC;`,
    sql`SELECT to_char(date, 'YYYY-MM-DD') AS date, sleep_hours, protein_grams, cardio_minutes, mood, energy, hunger, notes FROM daily_logs ORDER BY date ASC;`,
    sql`SELECT id, exercise_id, to_char(date, 'YYYY-MM-DD') AS date, set_index, weight_kg::float AS weight_kg, reps FROM exercise_sets ORDER BY date ASC, exercise_id, set_index;`,
  ]);

  const blob = {
    exportedAt: new Date().toISOString(),
    meta,
    weights,
    sessionLogs: sessions,
    dailyLogs: daily,
    exerciseSets: sets,
  };

  return new NextResponse(JSON.stringify(blob, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="recomp-export-${new Date().toISOString().split('T')[0]}.json"`,
    },
  });
}
