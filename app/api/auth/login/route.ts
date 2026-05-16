import { NextRequest, NextResponse } from 'next/server';
import { createSession, setAuthCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  const expected = process.env.APP_PASSWORD;

  if (!expected) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  // Basic timing-safe-ish comparison
  if (typeof password !== 'string' || password.length !== expected.length) {
    return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 401 });
  }

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (mismatch !== 0) {
    return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 401 });
  }

  const token = await createSession();
  await setAuthCookie(token);

  return NextResponse.json({ ok: true });
}
