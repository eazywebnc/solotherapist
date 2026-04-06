'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Heart,
  Calendar,
  Users,
  Clock,
  FileText,
  LogOut,
  Plus,
  ChevronRight,
  Video,
  CreditCard,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Appointment {
  id: string
  client_id: string
  date: string
  start_time: string
  duration_minutes: number
  type: string
  status: string
  notes: string | null
  st_clients: {
    id: string
    first_name: string
    last_name: string
  } | null
}

interface Client {
  id: string
  first_name: string
  last_name: string
  email: string | null
  status: string
}

interface Note {
  id: string
  client_id: string
  content: string
  mood_rating: number | null
  progress_rating: number | null
  created_at: string
}

interface Settings {
  session_rate: number | null
  currency: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [weekAppointments, setWeekAppointments] = useState<{ id: string; status: string }[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [settings, setSettings] = useState<Settings>({ session_rate: null, currency: 'EUR' })
  const [loading, setLoading] = useState(true)
  const [completedThisMonth, setCompletedThisMonth] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      setUser({ email: user.email || '' })

      // Ensure profile exists
      await fetch('/api/auth/ensure-profile', { method: 'POST' })

      // Fetch settings
      const { data: stSettings } = await supabase
        .from('st_settings')
        .select('session_rate, currency')
        .eq('user_id', user.id)
        .single()
      if (stSettings) setSettings(stSettings)

      // Today's date range
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]

      // Week range
      const weekStart = new Date(today)
      const day = weekStart.getDay()
      weekStart.setDate(weekStart.getDate() - day + (day === 0 ? -6 : 1))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const weekStartStr = weekStart.toISOString().split('T')[0]
      const weekEndStr = weekEnd.toISOString().split('T')[0]

      // Month range
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]

      // Fetch today's appointments
      const { data: todayAppts } = await supabase
        .from('st_appointments')
        .select('*, st_clients(id, first_name, last_name)')
        .eq('user_id', user.id)
        .eq('date', todayStr)
        .order('start_time', { ascending: true })

      setTodayAppointments(todayAppts || [])

      // Fetch week's appointments
      const { data: weekAppts } = await supabase
        .from('st_appointments')
        .select('id, status')
        .eq('user_id', user.id)
        .gte('date', weekStartStr)
        .lte('date', weekEndStr)

      setWeekAppointments(weekAppts || [])

      // Fetch completed this month
      const { count } = await supabase
        .from('st_appointments')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('date', monthStart)
        .lte('date', monthEnd)

      setCompletedThisMonth(count || 0)

      // Fetch clients
      const { data: pts } = await supabase
        .from('st_clients')
        .select('*')
        .eq('user_id', user.id)
        .neq('status', 'archived')
        .order('created_at', { ascending: false })

      setClients(pts || [])

      // Fetch recent notes
      const { data: notes } = await supabase
        .from('st_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentNotes(notes || [])
      setLoading(false)
    }
    init()
  }, [])

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

  const upcomingToday = todayAppointments.filter(a => a.status === 'confirmed')
  const revenueThisMonth = completedThisMonth * (settings.session_rate || 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080305] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080305]">
      {/* Top nav */}
      <header className="border-b border-white/5 bg-[#080305]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">SoloTherapist</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500 hidden sm:block">{user?.email}</span>
            <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Practice Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link
            href="/dashboard/schedule"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> New appointment
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total clients', value: String(clients.length), color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { icon: Calendar, label: "This week's appts", value: String(weekAppointments.length), color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { icon: TrendingUp, label: 'Completed this month', value: String(completedThisMonth), color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: DollarSign, label: 'Revenue this month', value: settings.session_rate ? `${revenueThisMonth.toLocaleString()} ${settings.currency}` : '--', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur"
            >
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard/clients"
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[2%] text-sm text-zinc-300 hover:bg-white/[4%] transition-all flex items-center gap-2"
          >
            <Users className="w-4 h-4 text-indigo-400" /> Clients
            <ChevronRight className="w-3 h-3 text-zinc-600" />
          </Link>
          <Link
            href="/dashboard/schedule"
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[2%] text-sm text-zinc-300 hover:bg-white/[4%] transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-violet-400" /> Schedule
            <ChevronRight className="w-3 h-3 text-zinc-600" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's appointments */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Today&apos;s Appointments
                <span className="text-xs text-zinc-500 ml-1">({todayAppointments.length})</span>
              </h2>
              <Link href="/dashboard/schedule" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                View schedule <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {todayAppointments.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <Calendar className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
                <p className="text-sm text-zinc-500 mb-2">No appointments today</p>
                <p className="text-xs text-zinc-600">
                  Schedule a session from the schedule page.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {todayAppointments.map((appt) => (
                  <div key={appt.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-white/[1%] transition-colors">
                    <div className="w-14 text-center shrink-0">
                      <p className="text-sm font-semibold text-indigo-400">{appt.start_time}</p>
                      <p className="text-[10px] text-zinc-600">{appt.duration_minutes}m</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate font-medium">
                        {appt.st_clients
                          ? `${appt.st_clients.first_name} ${appt.st_clients.last_name}`
                          : appt.type || 'Session'}
                      </p>
                      <p className="text-[11px] text-zinc-500 capitalize">{appt.type}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                    {appt.type?.toLowerCase().includes('video') && (
                      <Video className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Recent notes */}
            <div className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur overflow-hidden">
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  Recent Notes
                </h2>
              </div>

              {recentNotes.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">No session notes yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {recentNotes.map((note) => (
                    <div key={note.id} className="px-5 py-3 hover:bg-white/[1%] transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {note.mood_rating && (
                            <span className="text-[10px] text-indigo-400">Mood {note.mood_rating}/10</span>
                          )}
                          {note.progress_rating && (
                            <span className="text-[10px] text-violet-400">Progress {note.progress_rating}/10</span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-600">
                          {new Date(note.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { icon: Calendar, label: 'Schedule appointment', color: 'text-indigo-400 bg-indigo-500/10', href: '/dashboard/schedule' },
                  { icon: Users, label: 'Add new client', color: 'text-violet-400 bg-violet-500/10', href: '/dashboard/clients/new' },
                  { icon: FileText, label: 'View session notes', color: 'text-green-400 bg-green-500/10', href: '/dashboard/clients' },
                  { icon: Video, label: 'Start video session', color: 'text-blue-400 bg-blue-500/10', href: '#' },
                  { icon: CreditCard, label: 'Create invoice', color: 'text-emerald-400 bg-emerald-500/10', href: '#' },
                ].map(({ icon: Icon, label, color, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[3%] transition-colors text-left group"
                  >
                    <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">{label}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-700 ml-auto group-hover:text-zinc-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
