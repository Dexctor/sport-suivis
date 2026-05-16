import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await sql`
    SELECT to_char(date, 'YYYY-MM-DD') AS date, weight_kg::float AS weight
    FROM weights
    ORDER BY date ASC;
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const date = String(body.date || '').slice(0, 10);
  const weight = Number(body.weight);
  if (!date || isNaN(weight) || weight < 30 || weight > 250) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await sql`
    INSERT INTO weights (date, weight_kg)
    VALUES (${date}, ${weight})
    ON CONFLICT (date) DO UPDATE SET weight_kg = EXCLUDED.weight_kg;
  `;

  return NextResponse.json({ ok: true, date, weight });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });
  await sql`DELETE FROM weights WHERE date = ${date};`;
  return NextResponse.json({ ok: true });
}
