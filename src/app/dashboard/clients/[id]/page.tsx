'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Heart,
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Mail,
  Phone,
  Clock,
  Plus,
  LogOut,
  Loader2,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  notes: string | null
  status: string
  created_at: string
}

interface Appointment {
  id: string
  date: string
  start_time: string
  duration_minutes: number
  type: string
  status: string
  notes: string | null
}

interface Note {
  id: string
  content: string
  mood_rating: number | null
  progress_rating: number | null
  created_at: string
  appointment_id: string | null
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'notes'>('overview')
  const [deleting, setDeleting] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchClient()
  }, [id])

  const fetchClient = async () => {
    const res = await fetch(`/api/clients/${id}`)
    if (!res.ok) {
      router.push('/dashboard/clients')
      return
    }
    const data = await res.json()
    setClient(data.client)
    setAppointments(data.appointments || [])
    setNotes(data.notes || [])
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Archive this client? They will be hidden from your active list.')) return
    setDeleting(true)
    await fetch(`/api/clients/${id}`, { method: 'DELETE' })
    router.push('/dashboard/clients')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-blue-400 bg-blue-500/10'
      case 'completed': return 'text-green-400 bg-green-500/10'
      case 'cancelled': return 'text-red-400 bg-red-500/10'
      case 'no_show': return 'text-amber-400 bg-amber-500/10'
      default: return 'text-zinc-400 bg-zinc-500/10'
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const upcomingAppts = appointments.filter(
    (a) => a.status === 'confirmed' && new Date(a.date) >= new Date()
  )
  const pastAppts = appointments.filter(
    (a) => a.status !== 'confirmed' || new Date(a.date) < new Date()
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080305] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!client) return null

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
          <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition-colors" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Back + Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/clients" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-lg font-semibold text-indigo-300">
                {client.first_name[0]}{client.last_name[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {client.first_name} {client.last_name}
                </h1>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  client.status === 'active' ? 'text-green-400 bg-green-500/10' : 'text-zinc-400 bg-zinc-500/10'
                }`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
            title="Archive client"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Contact info */}
        <div className="flex flex-wrap gap-4 mb-8">
          {client.email && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Mail className="w-4 h-4 text-indigo-400" /> {client.email}
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Phone className="w-4 h-4 text-indigo-400" /> {client.phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <User className="w-4 h-4 text-indigo-400" /> Since {formatDate(client.created_at)}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 bg-white/[2%] rounded-xl border border-white/5 w-fit">
          {(['overview', 'appointments', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-zinc-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%]">
                <Calendar className="w-5 h-5 text-indigo-400 mb-2" />
                <p className="text-2xl font-bold text-white">{appointments.length}</p>
                <p className="text-xs text-zinc-500">Total appointments</p>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%]">
                <Clock className="w-5 h-5 text-violet-400 mb-2" />
                <p className="text-2xl font-bold text-white">{upcomingAppts.length}</p>
                <p className="text-xs text-zinc-500">Upcoming</p>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%]">
                <FileText className="w-5 h-5 text-green-400 mb-2" />
                <p className="text-2xl font-bold text-white">{notes.length}</p>
                <p className="text-xs text-zinc-500">Session notes</p>
              </div>
            </div>

            {/* Notes */}
            {client.notes && (
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[2%]">
                <h3 className="text-sm font-semibold text-white mb-2">Notes</h3>
                <p className="text-sm text-zinc-400 whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}

            {/* Quick action */}
            <Link
              href="/dashboard/schedule"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium hover:from-indigo-600 hover:to-violet-600 transition-all"
            >
              <Plus className="w-4 h-4" /> Schedule Appointment
            </Link>
          </motion.div>
        )}

        {/* Appointments tab */}
        {activeTab === 'appointments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No appointments yet</p>
              </div>
            ) : (
              <>
                {upcomingAppts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Upcoming</h3>
                    <div className="space-y-2">
                      {upcomingAppts.map((appt) => (
                        <div key={appt.id} className="p-4 rounded-xl border border-white/5 bg-white/[2%] flex items-center gap-4">
                          <div className="text-center shrink-0 w-14">
                            <p className="text-sm font-semibold text-indigo-400">{appt.start_time}</p>
                            <p className="text-[10px] text-zinc-600">{appt.duration_minutes}min</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">{formatDate(appt.date)}</p>
                            <p className="text-xs text-zinc-500 capitalize">{appt.type}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${getStatusColor(appt.status)}`}>
                            {appt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {pastAppts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Past</h3>
                    <div className="space-y-2">
                      {pastAppts.map((appt) => (
                        <div key={appt.id} className="p-4 rounded-xl border border-white/5 bg-white/[2%] flex items-center gap-4 opacity-60">
                          <div className="text-center shrink-0 w-14">
                            <p className="text-sm font-semibold text-zinc-400">{appt.start_time}</p>
                            <p className="text-[10px] text-zinc-600">{appt.duration_minutes}min</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white font-medium">{formatDate(appt.date)}</p>
                            <p className="text-xs text-zinc-500 capitalize">{appt.type}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${getStatusColor(appt.status)}`}>
                            {appt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Notes tab */}
        {activeTab === 'notes' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No session notes yet</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="p-5 rounded-xl border border-white/5 bg-white/[2%]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-zinc-500">{formatDate(note.created_at)}</span>
                    <div className="flex items-center gap-3">
                      {note.mood_rating && (
                        <span className="text-[10px] text-indigo-400">Mood: {note.mood_rating}/10</span>
                      )}
                      {note.progress_rating && (
                        <span className="text-[10px] text-violet-400">Progress: {note.progress_rating}/10</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
