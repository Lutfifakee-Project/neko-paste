'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const AVATAR_URL = '/icon.png'

export default function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const [content, setContent] = useState('')
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [id, setId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    params.then((p) => setId(p.id)).catch((err) => {
      setError(err.message)
      setLoading(false)
    })
  }, [params])

  useEffect(() => {
    if (!id) return
    fetch(`/api/paste/${id}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load')
        return data
      })
      .then((data) => {
        setContent(data.content)
        setExpiresAt(data.expiresAt)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="kawaii-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AVATAR_URL}
            width={80}
            height={80}
            className="mx-auto mb-3 animate-bounce rounded-full w-16 h-16 sm:w-20 sm:h-20"
            alt="Loading"
          />
          <p className="kawaii-subtitle text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="kawaii-bg min-h-screen flex items-center justify-center px-4">
        <div className="kawaii-error p-5 sm:p-6 text-center max-w-md">
          <p className="text-base sm:text-lg mb-3">Error: {error}</p>
          <Link href="/" className="kawaii-link">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="kawaii-bg min-h-screen py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="kawaii-card p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-pink-200">
            <div className="flex items-center gap-3 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AVATAR_URL}
                width={48}
                height={48}
                className="rounded-full border-2 border-pink-300 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
                alt="Avatar"
              />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold kawaii-title truncate">
                  Paste: {id}
                </h1>
                {expiresAt ? (
                  <p className="text-xs kawaii-subtitle">
                    Expires: {new Date(expiresAt).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-xs kawaii-subtitle">Never expires</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                href={`/raw/${id}`}
                target="_blank"
                className="kawaii-btn-sm"
              >
                Raw
              </Link>
              <button onClick={handleCopy} className="kawaii-btn-sm">
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <Link href="/" className="kawaii-btn-sm">
                New
              </Link>
            </div>
          </div>

          <pre className="kawaii-pre p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
            {content}
          </pre>
        </div>
      </div>
    </main>
  )
}
