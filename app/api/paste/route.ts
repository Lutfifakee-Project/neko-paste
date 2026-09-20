import { NextRequest, NextResponse } from 'next/server';
import { sql, ensureTable } from '@/lib/db';

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

const EXPIRATION_MAP: Record<string, number | null> = {
  never: null,
  '1h': 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
  '1w': 7 * 24 * 60 * 60 * 1000,
  '1mo': 30 * 24 * 60 * 60 * 1000,
  '1y': 365 * 24 * 60 * 60 * 1000,
};

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

export async function POST(request: NextRequest) {
  try {
    await retry(() => ensureTable());

    const contentType = request.headers.get('content-type') || '';
    let content = '';
    let filename: string | null = null;
    let filesize: number | null = null;
    let expiration = 'never';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      const file = formData.get('file');
      const textInput = formData.get('content');
      const expirationInput = formData.get('expiration');

      if (typeof expirationInput === 'string' && expirationInput in EXPIRATION_MAP) {
        expiration = expirationInput;
      }

      if (file instanceof File && file.size > 0) {
        if (file.size > 1_000_000) {
          return NextResponse.json(
            { error: 'File too large (max 1MB)' },
            { status: 413 }
          );
        }
        content = await file.text();
        const timestamp = Date.now();
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        filename = `${timestamp}-${cleanName}`;
        filesize = file.size;
      }

      if (!content && typeof textInput === 'string' && textInput.trim()) {
        content = textInput;
      }
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      content = body.content || '';
      if (body.expiration && body.expiration in EXPIRATION_MAP) {
        expiration = body.expiration;
      }
    } else {
      const text = await request.text();
      try {
        const body = JSON.parse(text);
        content = body.content || '';
      } catch {
        content = text;
      }
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'Content cannot be empty. Please paste text or upload a file.' },
        { status: 400 }
      );
    }

    const id = generateId();
    const ttl = EXPIRATION_MAP[expiration];
    const expiresAt = ttl === null ? null : new Date(Date.now() + ttl);

    await retry(() =>
      sql`
        INSERT INTO pastes (id, content, filename, filesize, expires_at)
        VALUES (${id}, ${content}, ${filename}, ${filesize}, ${expiresAt})
      `
    );

    return NextResponse.json({
      id,
      url: `/paste/${id}`,
      rawUrl: `/raw/${id}`,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    });
  } catch (error: any) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save paste. Please try again.' },
      { status: 500 }
    );
  }
}
