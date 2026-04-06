'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Heart,
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  ChevronRight,
  LogOut,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchClients()
  }, [search])

  const fetchClients = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    let query = supabase
      .from('st_clients')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'archived')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data } = await query
    setClients(data || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

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
          <h1 className="text-2xl font-bold text-white">Clients</h1>
        </div>
        <p className="text-sm text-zinc-500 mb-8 ml-10">
          {clients.length} client{clients.length !== 1 ? 's' : ''} in your practice
        </p>

        {/* Search + Add */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[3%] border border-white/5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>
          <Link
            href="/dashboard/clients/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium flex items-center gap-2 hover:from-indigo-600 hover:to-violet-600 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Add Client
          </Link>
        </div>

        {/* Client list */}
        {clients.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-sm text-zinc-500 mb-2">No clients yet</p>
            <p className="text-xs text-zinc-600 mb-6">Add your first client to get started.</p>
            <Link
              href="/dashboard/clients/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/dashboard/clients/${client.id}`}
                  className="block p-5 rounded-2xl border border-white/5 bg-white/[2%] backdrop-blur hover:bg-white/[4%] transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-sm font-semibold text-indigo-300">
                        {client.first_name[0]}{client.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {client.first_name} {client.last_name}
                        </p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          client.status === 'active'
                            ? 'text-green-400 bg-green-500/10'
                            : 'text-zinc-400 bg-zinc-500/10'
                        }`}>
                          {client.status}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                  </div>

                  <div className="space-y-1.5">
                    {client.email && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Phone className="w-3 h-3" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>

                  {client.notes && (
                    <p className="text-[11px] text-zinc-600 mt-3 line-clamp-2">{client.notes}</p>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
