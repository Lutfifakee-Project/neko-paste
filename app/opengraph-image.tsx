import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Neko-Paste — Your Simple Pastebin';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #fff5f8 0%, #ffd5e5 50%, #c8a2ff 100%)',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#ff6fa5',
            textShadow: '3px 3px 0 white, 6px 6px 0 #ffd5e5',
            marginBottom: '24px',
          }}
        >
          Neko-Paste
        </div>
        <div
          style={{
            fontSize: 40,
            color: '#b87a95',
            textAlign: 'center',
            maxWidth: '900px',
            fontWeight: 700,
          }}
        >
          Your Simple Pastebin
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#b87a95',
            textAlign: 'center',
            maxWidth: '900px',
            marginTop: '24px',
          }}
        >
          Simple, fast, and secure paste-sharing for text, code, and logs
        </div>
      </div>
    ),
    { ...size }
  );
}
