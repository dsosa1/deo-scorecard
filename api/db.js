import { sql } from '@vercel/postgres';

export async function initDb() {
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
