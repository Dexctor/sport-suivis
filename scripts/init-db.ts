import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!url) {
  console.error('No database URL found. Set DATABASE_URL or POSTGRES_URL in your .env.');
  process.exit(1);
}

const sql = neon(url);

async function main() {
  console.log('Initialising database schema...');

  await sql`
    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS weights (
      date DATE PRIMARY KEY,
      weight_kg NUMERIC(5,2) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS session_logs (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      date DATE NOT NULL,
      exercises JSONB NOT NULL,
      duration_sec INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(session_id, date)
    );
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_session_logs_date ON session_logs(date DESC);`;

  await sql`
    CREATE TABLE IF NOT EXISTS daily_logs (
      date DATE PRIMARY KEY,
      sleep_hours NUMERIC(3,1),
      protein_grams INTEGER,
      cardio_minutes INTEGER,
      mood INTEGER CHECK (mood BETWEEN 1 AND 10),
      energy INTEGER CHECK (energy BETWEEN 1 AND 10),
      hunger INTEGER CHECK (hunger BETWEEN 1 AND 10),
      notes TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS exercise_sets (
      id SERIAL PRIMARY KEY,
      exercise_id TEXT NOT NULL,
      date DATE NOT NULL,
      set_index INTEGER NOT NULL,
      weight_kg NUMERIC(5,2) NOT NULL,
      reps INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_exercise_sets_exercise_date
      ON exercise_sets(exercise_id, date);
  `;

  await sql`
    INSERT INTO app_meta (key, value)
    VALUES ('start_date', ${new Date().toISOString().split('T')[0]})
    ON CONFLICT (key) DO NOTHING;
  `;

  console.log('Schema ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(() => process.exit(0));
