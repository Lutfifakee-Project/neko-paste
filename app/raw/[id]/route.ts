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
        SELECT content, filename, expires_at
        FROM pastes
        WHERE id = ${id}
      `
    );

    if (result.length === 0) {
      return new NextResponse('Paste not found', { status: 404 });
    }

    const row = result[0] as {
      content: string;
      filename: string | null;
      expires_at: string | null;
    };

    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      await retry(() => sql`DELETE FROM pastes WHERE id = ${id}`);
      return new NextResponse('Paste has expired', { status: 410 });
    }

    return new NextResponse(row.content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(row.filename && {
          'Content-Disposition': `inline; filename="${row.filename}"`,
        }),
      },
    });
  } catch (error) {
    console.error('Raw fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
