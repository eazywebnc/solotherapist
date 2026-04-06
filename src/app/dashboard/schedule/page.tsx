'use client'

import { useEffect, useState, useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Heart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Appointment {
  id: string
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

function getWeekDates(baseDate: Date): Date[] {
  const start = new Date(baseDate)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Monday start
  start.setDate(diff)
  start.setHours(0, 0, 0, 0)

  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }
  return dates
}

function toDateString(d: Date): string {
  return d.toISOString().split('T')[0]
}

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const baseDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + weekOffset * 7)
    return d
  }, [weekOffset])

  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate])

  useEffect(() => {
    fetchAppointments()
  }, [weekOffset])

  const fetchAppointments = async () => {
    setLoading(true)
    const dateFrom = toDateString(weekDates[0])
    const dateTo = toDateString(weekDates[6])

    const res = await fetch(`/api/appointments?date_from=${dateFrom}&date_to=${dateTo}`)
    if (res.ok) {
      const data = await res.json()
      setAppointments(data.appointments || [])
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return 'border-l-blue-500 bg-blue-500/5'
      case 'completed': return 'border-l-green-500 bg-green-500/5'
      case 'cancelled': return 'border-l-red-500 bg-red-500/5'
      case 'no_show': return 'border-l-amber-500 bg-amber-500/5'
      default: return 'border-l-zinc-500 bg-zinc-500/5'
    }
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-400'
      case 'completed': return 'bg-green-400'
      case 'cancelled': return 'bg-red-400'
      case 'no_show': return 'bg-amber-400'
      default: return 'bg-zinc-400'
    }
  }

  const today = toDateString(new Date())

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {}
    for (const d of weekDates) {
      map[toDateString(d)] = []
    }
    for (const appt of appointments) {
      const key = appt.date
      if (map[key]) {
        map[key].push(appt)
      }
    }
    // Sort each day by start_time
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.start_time.localeCompare(b.start_time))
    }
    return map
  }, [appointments, weekDates])

  const weekLabel = `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-zinc-400" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Schedule</h1>
        </div>

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-6 mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-400" />
            </button>
            <span className="text-sm font-medium text-white min-w-[200px] text-center">{weekLabel}</span>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 rounded-lg border border-white/5 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Today
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-3">
            {weekDates.map((date) => {
              const key = toDateString(date)
              const isToday = key === today
              const dayAppts = appointmentsByDay[key] || []

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl border ${
                    isToday ? 'border-indigo-500/30 bg-indigo-500/[3%]' : 'border-white/5 bg-white/[2%]'
                  } min-h-[300px] flex flex-col`}
                >
                  {/* Day header */}
                  <div className={`px-3 py-2.5 border-b ${isToday ? 'border-indigo-500/20' : 'border-white/5'} text-center`}>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? 'text-indigo-400' : 'text-white'}`}>
                      {date.getDate()}
                    </p>
                  </div>

                  {/* Appointments */}
                  <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                    {dayAppts.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <Calendar className="w-4 h-4 text-zinc-800" />
                      </div>
                    ) : (
                      dayAppts.map((appt) => (
                        <div
                          key={appt.id}
                          className={`p-2 rounded-lg border-l-2 ${getStatusStyle(appt.status)} cursor-pointer hover:brightness-125 transition-all`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusDot(appt.status)}`} />
                            <span className="text-[10px] font-medium text-white">
                              {appt.start_time}
                            </span>
                          </div>
                          {appt.st_clients && (
                            <p className="text-[11px] text-zinc-300 font-medium truncate">
                              {appt.st_clients.first_name} {appt.st_clients.last_name}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-zinc-500 capitalize">{appt.type}</span>
                            <span className="text-[9px] text-zinc-600 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" /> {appt.duration_minutes}m
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-5 mt-6 justify-center">
          {[
            { label: 'Upcoming', color: 'bg-blue-400' },
            { label: 'Completed', color: 'bg-green-400' },
            { label: 'Cancelled', color: 'bg-red-400' },
            { label: 'No show', color: 'bg-amber-400' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-[10px] text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
