'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Heart, Calendar, FileText, Video, Users2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ---- Practice Dashboard Mockup ---- */
function PracticeMockup() {
  const [activeTab, setActiveTab] = useState<'today' | 'notes' | 'video'>('today')

  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveTab((t) => t === 'today' ? 'notes' : t === 'notes' ? 'video' : 'today')
    }, 4000)
    return () => clearInterval(cycle)
  }, [])

  const patients = [
    { name: 'Marie L.', time: '09:00', type: 'Anxiety session', status: 'upcoming', avatar: 'ML' },
    { name: 'Thomas B.', time: '10:30', type: 'CBT follow-up', status: 'active', avatar: 'TB' },
    { name: 'Sophie R.', time: '14:00', type: 'Initial consult', status: 'upcoming', avatar: 'SR' },
    { name: 'Pierre M.', time: '15:30', type: 'Stress mgmt', status: 'upcoming', avatar: 'PM' },
  ]

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-6 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />

      <div className="relative rounded-2xl border border-teal-500/20 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-teal-500/10">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-white">My Practice</span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400 font-medium">Live</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {[
            { id: 'today', icon: Calendar, label: "Today" },
            { id: 'notes', icon: FileText, label: 'Notes' },
            { id: 'video', icon: Video, label: 'Video' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'today' | 'notes' | 'video')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-all ${
                activeTab === id
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 min-h-[240px]">
          <AnimatePresence mode="wait">

            {/* Today's appointments */}
            {activeTab === 'today' && (
              <motion.div
                key="today"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-2"
              >
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide mb-3">Monday, April 6 · 4 sessions</p>
                {patients.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                      p.status === 'active'
                        ? 'bg-teal-500/10 border border-teal-500/20'
                        : 'bg-white/[2%] border border-white/5 hover:bg-white/[4%]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                      p.status === 'active' ? 'bg-teal-500 text-white' : 'bg-white/10 text-zinc-400'
                    }`}>
                      {p.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-zinc-500">{p.type}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[11px] font-semibold ${p.status === 'active' ? 'text-teal-400' : 'text-zinc-400'}`}>{p.time}</p>
                      {p.status === 'active' && (
                        <span className="text-[9px] text-teal-400 font-medium">In progress</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Quick notes */}
            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wide font-medium">Session note · Thomas B.</p>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[9px] font-medium">Saved</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[3%] border border-white/5 space-y-2">
                  {[
                    { label: 'Presenting issues', value: 'Work-related anxiety, sleep disruptions for 3 weeks.' },
                    { label: 'Interventions', value: 'Breathing exercises, cognitive reframing, homework set.' },
                    { label: 'Plan', value: 'Follow-up in 2 weeks. Refer to psychiatrist if no improvement.' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[9px] font-bold text-teal-400 uppercase tracking-wide">{label}</p>
                      <p className="text-[11px] text-zinc-300 leading-relaxed mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[9px] font-medium">HIPAA-ready</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[9px] font-medium">Encrypted</span>
                </div>
              </motion.div>
            )}

            {/* Video session */}
            {activeTab === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col items-center justify-center h-full py-4 space-y-4"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center">
                    <Video className="w-10 h-10 text-teal-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-[8px] text-white font-bold">HD</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Next: Marie L.</p>
                  <p className="text-[11px] text-zinc-500">Video session · Today 09:00</p>
                </div>
                <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-semibold">
                  Join session
                </button>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[9px] font-medium">End-to-end encrypted</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-medium">No download needed</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-teal-500/6 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 grid-bg" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — Text */}
        <div ref={textRef} className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-sm mb-8"
          >
            <Heart className="w-4 h-4" />
            Built for solo practitioners
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            {['Your', 'practice,'].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="inline-block mr-[0.3em] text-foreground"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="inline-block mr-[0.3em] text-foreground"
            >
              simplified.
            </motion.span>
            <br />
            <span className="gradient-text">
              {Array.from('One platform.').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, delay: 0.38 + i * 0.04 }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-10"
          >
            Appointments, patient notes, invoicing and video calls — all in one
            secure platform. Stop juggling tools and focus on what matters: your patients.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-12"
          >
            <Link
              href="/auth/login"
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 flex items-center gap-2"
            >
              Start free trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl border border-white/10 text-zinc-300 font-medium text-lg hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-8 justify-center lg:justify-start"
          >
            {[
              { icon: Users2, label: 'Practitioners', value: '2,000+', color: 'text-teal-400' },
              { icon: Heart, label: 'Satisfaction', value: '98%', color: 'text-rose-400' },
              { icon: Calendar, label: 'Time saved / week', value: '5h', color: 'text-cyan-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center lg:text-left">
                <div className={`inline-flex items-center gap-1.5 ${color} mb-0.5`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xl font-bold">{value}</span>
                </div>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Practice mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PracticeMockup />
        </motion.div>
      </div>
    </section>
  )
}
