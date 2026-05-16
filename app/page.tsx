import { headers } from 'next/headers';
import Tracker from '@/components/Tracker';

export const dynamic = 'force-dynamic';

async function getInitialState() {
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const cookie = h.get('cookie') || '';

  try {
    const res = await fetch(`${proto}://${host}/api/state`, {
      cache: 'no-store',
      headers: { cookie },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const initial = await getInitialState();
  return <Tracker initial={initial} />;
}
