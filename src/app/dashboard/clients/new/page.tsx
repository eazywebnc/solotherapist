'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Heart,
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewClientPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError('First name and last name are required.')
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create client.')
        setSaving(false)
        return
      }

      router.push(`/dashboard/clients/${data.client.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl bg-white/[3%] border border-white/5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all'

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">SoloTherapist</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard/clients" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Add New Client</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Fill in the details below.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
                <User className="w-3.5 h-3.5" /> First Name *
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                placeholder="Jane"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
                <User className="w-3.5 h-3.5" /> Last Name *
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                placeholder="Doe"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="jane@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+687 12 34 56"
              className={inputClass}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-medium">
              <FileText className="w-3.5 h-3.5" /> Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any relevant notes about this client..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/dashboard/clients"
              className="px-5 py-2.5 rounded-xl border border-white/5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                'Add Client'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
