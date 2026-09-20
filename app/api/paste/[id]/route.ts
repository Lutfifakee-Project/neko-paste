import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 1500
): Promise<T> {
  let lastError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastError;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await retry(() =>
      sql`
        SELECT content, filename, created_at, expires_at
        FROM pastes
        WHERE id = ${id}
      `
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    const row = result[0] as {
      content: string;
      filename: string | null;
      created_at: string;
      expires_at: string | null;
    };

    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      await retry(() => sql`DELETE FROM pastes WHERE id = ${id}`);
      return NextResponse.json({ error: 'Paste has expired' }, { status: 410 });
    }

    return NextResponse.json({
      content: row.content,
      filename: row.filename,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paste. Please try again.' },
      { status: 500 }
    );
  }
}
