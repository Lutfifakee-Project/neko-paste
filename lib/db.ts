import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Database URL not found. Set POSTGRES_URL or DATABASE_URL in environment variables.'
  );
}

export const sql = neon(databaseUrl);

export async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS pastes (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      filename TEXT,
      filesize INTEGER,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`ALTER TABLE pastes ADD COLUMN IF NOT EXISTS filename TEXT;`;
  await sql`ALTER TABLE pastes ADD COLUMN IF NOT EXISTS filesize INTEGER;`;
  await sql`ALTER TABLE pastes ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;`;
}
