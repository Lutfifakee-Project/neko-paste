import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL('http://localhost:3000');
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),

  title: {
    default: "Neko-Paste — Your Simple Pastebin",
    template: "%s | Neko-Paste",
  },
  description: "Neko-Paste — A simple, fast, and secure paste-sharing service for text, code, logs, and more. Create, share, and access your pastes with ease.",
  applicationName: "Neko-Paste",

  authors: [{ name: "Lutfifakee", url: "https://lutfifakee.top" }],
  creator: "Lutfifakee",
  publisher: "Lutfifakee",

  keywords: [
    "raw paste",
    "pastebin",
    "paste",
    "text sharing",
    "code sharing",
    "save text online",
    "share code",
    "share logs",
    "developer tools",
    "neko paste",
    "neko-paste",
    "raw pastebin",
    "instant paste",
    "file upload",
    "just paste",
    "online text editor",
  ],

  category: "Developer Tools",

  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: "/manifest.json",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    title: "Neko-Paste — Your Simple Pastebin",
    description: "Neko-Paste — A simple, fast, and secure paste-sharing service for text, code, logs, and more. Create, share, and access your pastes with ease.",
    siteName: "Neko-Paste",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    site: "@lutfifakee",
    creator: "@lutfifakee",
    title: "Neko-Paste — Your Simple Pastebin",
    description: "Neko-Paste — A simple, fast, and secure paste-sharing service for text, code, logs, and more. Create, share, and access your pastes with ease.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff6fa5",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mt-12 pb-6 text-center text-sm kawaii-subtitle px-4">
          Made with love by{" "}
          <a
            href="https://lutfifakee.top"
            target="_blank"
            rel="noopener noreferrer"
            className="kawaii-link"
          >
            Lutfifakee
          </a>
          {" · "}
          <a
            href="https://github.com/Lutfifakee-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="kawaii-link"
          >
            GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
