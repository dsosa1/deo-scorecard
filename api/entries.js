import { sql } from '@vercel/postgres';
import { initDb } from './db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  await initDb();

  // GET all entries
  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM entries ORDER BY year, month`;
    return res.status(200).json(rows);
  }

  // POST - save or update an entry
  if (req.method === 'POST') {
    const { month, year, patients, production, spend, np_production } = req.body;
    await sql`
      INSERT INTO entries (month, year, patients, production, spend, np_production)
      VALUES (${month}, ${year}, ${patients}, ${production}, ${spend}, ${np_production})
      ON CONFLICT (month, year) DO UPDATE SET
        patients = EXCLUDED.patients,
        production = EXCLUDED.production,
        spend = EXCLUDED.spend,
        np_production = EXCLUDED.np_production
    `;
    return res.status(200).json({ success: true });
  }

  // DELETE an entry
  if (req.method === 'DELETE') {
    const { month, year } = req.body;
    await sql`DELETE FROM entries WHERE month = ${month} AND year = ${year}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
