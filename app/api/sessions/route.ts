import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await sql`
    SELECT id, session_id, to_char(date, 'YYYY-MM-DD') AS date, exercises, duration_sec
    FROM session_logs
    ORDER BY date DESC
    LIMIT 200;
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const sessionId = String(body.sessionId || '');
  const date = String(body.date || '').slice(0, 10);
  const exercises = body.exercises;
  const durationSec = body.durationSec ? Number(body.durationSec) : null;

  if (!sessionId || !date || !exercises) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const exercisesJson = JSON.stringify(exercises);
  await sql`
    INSERT INTO session_logs (session_id, date, exercises, duration_sec)
    VALUES (${sessionId}, ${date}, ${exercisesJson}::jsonb, ${durationSec})
    ON CONFLICT (session_id, date) DO UPDATE
      SET exercises = EXCLUDED.exercises,
          duration_sec = EXCLUDED.duration_sec;
  `;

  // Re-derive the per-set rows for this session+date for time-series queries
  const exerciseIds = Object.keys(exercises);
  if (exerciseIds.length > 0) {
    await sql`
      DELETE FROM exercise_sets
      WHERE date = ${date}
        AND exercise_id = ANY(${exerciseIds});
    `;
  }

  for (const [exerciseId, sets] of Object.entries(
    exercises as Record<string, Array<{ w: string; r: string; done: boolean }>>,
  )) {
    let idx = 0;
    for (const set of sets) {
      const w = parseFloat(set.w);
      const r = parseInt(set.r, 10);
      if (set.done && !isNaN(w) && !isNaN(r) && w > 0 && r > 0) {
        await sql`
          INSERT INTO exercise_sets (exercise_id, date, set_index, weight_kg, reps)
          VALUES (${exerciseId}, ${date}, ${idx}, ${w}, ${r});
        `;
      }
      idx++;
    }
  }

  return NextResponse.json({ ok: true });
}
