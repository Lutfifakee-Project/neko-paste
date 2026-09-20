import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.log('Warning: .env.local not found, using system env');
}

const databaseUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('POSTGRES_URL or DATABASE_URL not found');
  process.exit(1);
}

console.log('Database URL found, connecting...');

const sql = neon(databaseUrl);

async function createTable() {
  try {
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
    console.log('Table "pastes" created/updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create table:', error);
    process.exit(1);
  }
}

createTable();
