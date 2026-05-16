import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const exerciseId = url.searchParams.get('exerciseId');

  if (exerciseId) {
    const rows = await sql`
      SELECT to_char(date, 'YYYY-MM-DD') AS date,
             MAX(weight_kg)::float AS top_weight,
             SUM(weight_kg * reps)::float AS volume,
             MAX(reps)::int AS top_reps,
             COUNT(*)::int AS sets
      FROM exercise_sets
      WHERE exercise_id = ${exerciseId}
      GROUP BY date
      ORDER BY date ASC;
    `;
    return NextResponse.json(rows);
  }

  const rows = await sql`
    SELECT exercise_id,
           MAX(date)::text AS last_date,
           MAX(weight_kg)::float AS all_time_top
    FROM exercise_sets
    GROUP BY exercise_id;
  `;
  return NextResponse.json(rows);
}
