<div align="center">

# Neko-Paste

**Simple, fast, and secure paste sharing.**

A modern paste-sharing service for text, code, logs, and more. Create, share, and access your pastes with ease.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://neko-paste.vercel.app) · [Report Bug](https://github.com/Lutfifakee-Project/neko-paste/issues) · [Request Feature](https://github.com/Lutfifakee-Project/neko-paste/issues)

</div>

---

## ✨ Features

- **Paste Text or Upload Files** — Share code, logs, JSON, CSV, and other text-based files.
- **Raw Links** — Every paste can be accessed directly through a raw URL.
- **Custom Expiration** — Choose when your paste should expire.
- **Automatic Cleanup** — Expired pastes are automatically removed when accessed.
- **SEO Optimized** — Includes metadata, Open Graph, Twitter Cards, sitemap, and robots.txt.
- **PWA Ready** — Install Neko-Paste as a Progressive Web App.
- **Responsive Design** — Designed for desktop, tablet, and mobile devices.
- **Dark Mode** — Automatically follows the system color scheme.
- **Retry Logic** — Automatically retries database connections when needed.
- **Kawaii UI** — A clean and cute pink-inspired interface.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) — App Router + Turbopack
- **Language:** [TypeScript 5](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **Database:** [Neon](https://neon.tech) — Serverless PostgreSQL
- **Deployment:** [Vercel](https://vercel.com)
- **Fonts:** [Geist](https://vercel.com/font) by Vercel

---

## 📦 Getting Started

### Prerequisites

Make sure you have:

- [Node.js](https://nodejs.org) 20 or higher
- npm, pnpm, or yarn
- A [Neon](https://neon.tech) account

### 1. Clone the Repository

```bash
git clone https://github.com/Lutfifakee-Project/neko-paste.git
cd neko-paste
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your Neon PostgreSQL connection string:

```env
POSTGRES_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

> **Tip:** Use the pooled connection provided by Neon when available.

You can get your connection string from:

[Neon Console](https://console.neon.tech/) → Select your project → **Connect** → **Pooled connection**

### 4. Create the Database Table

Run:

```bash
node scripts/create-table.js
```

A successful setup should display something similar to:

```text
Database URL found, connecting...
Table "pastes" created/updated successfully!
```

### 5. Start the Development Server

```bash
npm run dev
```

Then open:

[http://localhost:3000](http://localhost:3000)

---

## 🛠️ Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `node scripts/create-table.js` | Create or update the database table |

---

## 📁 Project Structure

```text
neko-paste/
├── app/
│   ├── api/
│   │   └── paste/
│   │       ├── route.ts              # Create paste
│   │       └── [id]/
│   │           └── route.ts          # Fetch paste as JSON
│   ├── raw/
│   │   └── [id]/
│   │       └── route.ts              # Fetch paste as raw text
│   ├── paste/
│   │   └── [id]/
│   │       └── page.tsx              # Paste viewer
│   ├── page.tsx                      # Home page
│   ├── layout.tsx                    # Root layout and metadata
│   ├── opengraph-image.tsx           # Dynamic Open Graph image
│   ├── robots.ts                     # robots.txt
│   ├── sitemap.ts                    # sitemap.xml
│   └── globals.css                   # Global styles
├── lib/
│   └── db.ts                         # Neon database connection
├── public/
│   ├── icon.png                      # Main icon
│   ├── icon-192.png                  # PWA icon
│   ├── icon-512.png                  # PWA icon
│   ├── apple-icon.png                # Apple touch icon
│   ├── og-image.png                  # Open Graph image
│   └── manifest.json                 # PWA manifest
├── scripts/
│   └── create-table.js               # Database setup script
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### `POST /api/paste`

Creates a new paste.

#### Request

`multipart/form-data`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | File | No | Text-based file to upload |
| `content` | string | No | Paste content |
| `expiration` | string | No | Paste expiration setting |

Supported expiration values:

```text
never
1h
1d
1w
1mo
1y
```

#### Response

```json
{
  "id": "abc12345",
  "url": "/paste/abc12345",
  "rawUrl": "/raw/abc12345",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

---

### `GET /api/paste/[id]`

Fetches paste metadata and content as JSON.

Example:

```text
GET /api/paste/abc12345
```

---

### `GET /raw/[id]`

Returns the paste content as plain text.

Example:

```text
GET /raw/abc12345
```

This endpoint is intended for direct raw access and integrations.

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub

If the repository has not been initialized yet:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Lutfifakee-Project/neko-paste.git
git push -u origin main
```

### 2. Import the Project to Vercel

1. Open [Vercel](https://vercel.com/new)
2. Import the `neko-paste` repository
3. Configure the project if necessary
4. Click **Deploy**

### 3. Configure Environment Variables

Open:

**Vercel Dashboard → Project → Settings → Environment Variables**

Add:

| Variable | Description | Environments |
| --- | --- | --- |
| `POSTGRES_URL` | Neon PostgreSQL connection string | Production, Preview, Development |
| `DATABASE_URL` | Neon PostgreSQL connection string | Production, Preview, Development |

### 4. Redeploy

After adding or changing environment variables, redeploy the latest deployment from the Vercel dashboard.

---

## 🎨 Customization

### Change Title & Description

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: "Neko-Paste",
    template: "%s | Neko-Paste",
  },
  description:
    "A simple, fast, and secure paste-sharing service for text, code, logs, and more.",
};
```

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --pink: #ff9ec4;
  --pink-dark: #ff6fa5;
  --pink-light: #ffd5e5;
  --purple: #c8a2ff;
}
```

### Change Icons

Replace the corresponding files in `public/`:

```text
public/
├── icon.png
├── icon-192.png
├── icon-512.png
└── apple-icon.png
```

Recommended sizes:

| File | Size |
| --- | --- |
| `icon.png` | 512×512 |
| `icon-192.png` | 192×192 |
| `icon-512.png` | 512×512 |
| `apple-icon.png` | 180×180 |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Lutfifakee**

- Website: [lutfifakee.top](https://lutfifakee.top/)
- GitHub: [@Lutfifakee-Project](https://github.com/Lutfifakee-Project)

---

## ⭐ Show Your Support

If Neko-Paste is useful to you, consider giving the repository a ⭐ on GitHub.

---

<div align="center">

**Made with ❤️ by [Lutfifakee](https://lutfifakee.top/)**

</div>