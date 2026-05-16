import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let _sql: NeonQueryFunction<false, false> | null = null;

const getSqlClient = (): NeonQueryFunction<false, false> => {
  if (_sql) return _sql;
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (!url) {
    throw new Error(
      'No database URL configured. Set DATABASE_URL or POSTGRES_URL in your environment.',
    );
  }
  _sql = neon(url);
  return _sql;
};

// Proxy so the rest of the codebase keeps using `await sql\`...\`` exactly as before,
// without paying the init cost (or failing) at module-load time.
export const sql = ((...args: Parameters<NeonQueryFunction<false, false>>) => {
  const client = getSqlClient();
  return (client as (...a: typeof args) => ReturnType<typeof client>)(...args);
}) as NeonQueryFunction<false, false>;
