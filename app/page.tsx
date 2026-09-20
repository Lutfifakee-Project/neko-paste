'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const AVATAR_URL = '/icon.png'

const EXPIRATION_OPTIONS = [
  { value: 'never', label: 'Never' },
  { value: '1h', label: '1 Hour' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
  { value: '1mo', label: '1 Month' },
  { value: '1y', label: '1 Year' },
]

export default function Home() {
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [expiration, setExpiration] = useState('never')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ id: string; expiresAt: string | null } | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && !file) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const fd = new FormData()
      if (file) fd.append('file', file)
      else fd.append('content', content)
      fd.append('expiration', expiration)

      const res = await fetch('/api/paste', {
        method: 'POST',
        body: fd,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      setResult(data)
      setContent('')
      setFile(null)
      setExpiration('never')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="kawaii-bg min-h-screen py-8 px-4 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="avatar-frame mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR_URL}
              alt="Neko-Paste avatar"
              width={120}
              height={120}
              className="rounded-full w-24 h-24 sm:w-32 sm:h-32"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold kawaii-title text-center">
            Neko-Paste
          </h1>
          <p className="kawaii-subtitle mt-2 text-center text-sm sm:text-base px-4">
            Your simple pastebin. Fast, minimal, and secure.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="kawaii-card space-y-4 p-4 sm:p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your text or code here..."
            className="kawaii-textarea w-full h-48 sm:h-64 p-3 sm:p-4 text-sm sm:text-base"
            disabled={loading || !!file}
            aria-label="Paste content"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <label className="kawaii-file-btn cursor-pointer text-sm">
                <span>Choose File</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.json,.csv,.js,.ts,.tsx,.jsx,.py,.html,.css,.log,.xml,.yml,.yaml,.sh,.java,.go,.rs,.php,.rb,.sql"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null)
                    setContent('')
                  }}
                  className="hidden"
                  aria-label="Choose file to upload"
                />
              </label>
              {file && (
                <div className="flex items-center gap-2 text-xs sm:text-sm flex-1 min-w-0">
                  <span className="kawaii-filename truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="kawaii-remove flex-shrink-0"
                    aria-label="Remove file"
                  >
                    remove
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="expiration"
                className="text-sm kawaii-subtitle whitespace-nowrap"
              >
                Expiration:
              </label>
              <select
                id="expiration"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="kawaii-select flex-1"
                disabled={loading}
                aria-label="Expiration time"
              >
                {EXPIRATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!content.trim() && !file)}
            className="kawaii-btn w-full py-3 text-sm sm:text-base"
          >
            {loading ? 'Saving...' : 'Create Paste'}
          </button>
        </form>

        {error && (
          <div className="kawaii-error mt-4 p-3 sm:p-4 text-sm" role="alert">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="kawaii-success mt-4 p-4 sm:p-5">
            <p className="font-bold mb-3 text-base sm:text-lg">
              Paste created successfully!
            </p>
            <div className="space-y-3 text-sm">
              <div className="break-all">
                <span className="opacity-80">Paste link: </span>
                <Link
                  href={`/paste/${result.id}`}
                  target="_blank"
                  className="kawaii-link"
                >
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/paste/${result.id}`
                    : `/paste/${result.id}`}
                </Link>
              </div>
              <div className="break-all">
                <span className="opacity-80">Raw link: </span>
                <Link
                  href={`/raw/${result.id}`}
                  target="_blank"
                  className="kawaii-link"
                >
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/raw/${result.id}`
                    : `/raw/${result.id}`}
                </Link>
              </div>
              {result.expiresAt && (
                <div className="text-xs opacity-70">
                  Expires on: {new Date(result.expiresAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
