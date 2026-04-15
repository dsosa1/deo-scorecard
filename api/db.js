import { neon } from '@neondatabase/serverless';

export function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}

export async function initDb() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      patients INTEGER NOT NULL,
      production NUMERIC NOT NULL,
      spend NUMERIC NOT NULL,
      np_production NUMERIC NOT NULL,
      UNIQUE(month, year)
    )
  `;
}
