import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const since = url.searchParams.get('since');

  const rows = since
    ? await sql`
        SELECT to_char(date, 'YYYY-MM-DD') AS date,
               sleep_hours, protein_grams, cardio_minutes, mood, energy, hunger, notes
        FROM daily_logs
        WHERE date >= ${since}
        ORDER BY date DESC;
      `
    : await sql`
        SELECT to_char(date, 'YYYY-MM-DD') AS date,
               sleep_hours, protein_grams, cardio_minutes, mood, energy, hunger, notes
        FROM daily_logs
        ORDER BY date DESC
        LIMIT 365;
      `;

  return NextResponse.json(rows);
}

const numOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const intOrNull = (v: unknown, min: number, max: number): number | null => {
  const n = numOrNull(v);
  if (n === null) return null;
  const i = Math.round(n);
  if (i < min || i > max) return null;
  return i;
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const date = String(body.date || '').slice(0, 10);
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

  const sleep = numOrNull(body.sleep_hours);
  const protein = numOrNull(body.protein_grams);
  const cardio = numOrNull(body.cardio_minutes);
  const mood = intOrNull(body.mood, 1, 10);
  const energy = intOrNull(body.energy, 1, 10);
  const hunger = intOrNull(body.hunger, 1, 10);
  const notes = body.notes ? String(body.notes).slice(0, 1000) : null;

  await sql`
    INSERT INTO daily_logs (date, sleep_hours, protein_grams, cardio_minutes, mood, energy, hunger, notes, updated_at)
    VALUES (${date}, ${sleep}, ${protein}, ${cardio}, ${mood}, ${energy}, ${hunger}, ${notes}, NOW())
    ON CONFLICT (date) DO UPDATE SET
      sleep_hours = EXCLUDED.sleep_hours,
      protein_grams = EXCLUDED.protein_grams,
      cardio_minutes = EXCLUDED.cardio_minutes,
      mood = EXCLUDED.mood,
      energy = EXCLUDED.energy,
      hunger = EXCLUDED.hunger,
      notes = EXCLUDED.notes,
      updated_at = NOW();
  `;

  return NextResponse.json({ ok: true });
}
