import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PROFILE_KEYS = ['height_cm', 'age', 'sex', 'activity_level', 'deficit_pct'] as const;

type ProfileKey = (typeof PROFILE_KEYS)[number];

type Profile = {
  height_cm: number | null;
  age: number | null;
  sex: 'M' | 'F' | null;
  activity_level: number | null; // 1.2 / 1.375 / 1.55 / 1.725 / 1.9
  deficit_pct: number | null; // e.g. 20 for -20%
};

const emptyProfile = (): Profile => ({
  height_cm: null,
  age: null,
  sex: null,
  activity_level: null,
  deficit_pct: null,
});

export async function GET() {
  const rows = await sql`
    SELECT key, value FROM app_meta
    WHERE key = ANY(${PROFILE_KEYS as readonly string[] as string[]});
  `;

  const profile = emptyProfile();
  for (const row of rows as Array<{ key: string; value: string }>) {
    const k = row.key as ProfileKey;
    if (k === 'sex') {
      profile.sex = row.value === 'M' || row.value === 'F' ? row.value : null;
    } else {
      const n = Number(row.value);
      if (!isNaN(n)) (profile as Record<ProfileKey, number | null | 'M' | 'F'>)[k] = n;
    }
  }

  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

  const updates: Array<[ProfileKey, string]> = [];

  if (body.height_cm !== undefined) {
    const n = Number(body.height_cm);
    if (n >= 120 && n <= 230) updates.push(['height_cm', String(n)]);
  }
  if (body.age !== undefined) {
    const n = Number(body.age);
    if (n >= 14 && n <= 100) updates.push(['age', String(Math.round(n))]);
  }
  if (body.sex !== undefined) {
    if (body.sex === 'M' || body.sex === 'F') updates.push(['sex', body.sex]);
  }
  if (body.activity_level !== undefined) {
    const n = Number(body.activity_level);
    if (n >= 1.0 && n <= 2.5) updates.push(['activity_level', String(n)]);
  }
  if (body.deficit_pct !== undefined) {
    const n = Number(body.deficit_pct);
    if (n >= 0 && n <= 40) updates.push(['deficit_pct', String(Math.round(n))]);
  }

  for (const [key, value] of updates) {
    await sql`
      INSERT INTO app_meta (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    `;
  }

  return NextResponse.json({ ok: true });
}
