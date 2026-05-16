import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const [meta, weights, sessions, daily] = await Promise.all([
    sql`SELECT key, value FROM app_meta;`,
    sql`SELECT to_char(date, 'YYYY-MM-DD') AS date, weight_kg::float AS weight FROM weights ORDER BY date ASC;`,
    sql`
      SELECT id, session_id, to_char(date, 'YYYY-MM-DD') AS date, exercises, duration_sec
      FROM session_logs
      ORDER BY date DESC
      LIMIT 200;
    `,
    sql`
      SELECT to_char(date, 'YYYY-MM-DD') AS date, sleep_hours, protein_grams, cardio_minutes, mood, energy, hunger, notes
      FROM daily_logs
      ORDER BY date DESC
      LIMIT 200;
    `,
  ]);

  const metaMap: Record<string, string> = {};
  for (const row of meta as Array<{ key: string; value: string }>) {
    metaMap[row.key] = row.value;
  }

  return NextResponse.json({
    startDate: metaMap.start_date || new Date().toISOString().split('T')[0],
    weightLog: (weights as Array<{ date: string; weight: number }>).map((r) => ({
      date: r.date,
      weight: Number(r.weight),
    })),
    sessionLogs: sessions,
    dailyLogs: daily,
  });
}
