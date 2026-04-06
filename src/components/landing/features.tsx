'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  Calendar,
  Users,
  FileText,
  Video,
  CreditCard,
  Bell,
  TrendingUp,
  MessageSquare,
} from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Online booking page for patients. Sync with Google Calendar. Automated reminders reduce no-shows by 60%.',
    gradient: 'from-teal-500 to-cyan-500',
    glow: 'bg-teal-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: Users,
    title: 'Patient Management',
    description: 'Complete patient profiles with history, documents, and session records all in one place.',
    gradient: 'from-cyan-500 to-blue-500',
    glow: 'bg-cyan-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: FileText,
    title: 'Clinical Notes (HIPAA-ready)',
    description: 'Structured session notes with templates. Encrypted, compliant, and instantly searchable.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'bg-emerald-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Video,
    title: 'Built-in Video Sessions',
    description: 'HD video calls directly in the app — no downloads, no Zoom links. End-to-end encrypted for privacy.',
    gradient: 'from-teal-500 to-emerald-500',
    glow: 'bg-teal-500/20',
    span: 'md:col-span-2',
  },
  {
    icon: CreditCard,
    title: 'Invoicing & Payments',
    description: 'Generate invoices, accept card payments, and track what\'s paid or outstanding — automatically.',
    gradient: 'from-cyan-500 to-teal-500',
    glow: 'bg-cyan-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: Bell,
    title: 'Appointment Reminders',
    description: 'Email & SMS reminders for patients. Customizable timing and message. Reduce cancellations.',
    gradient: 'from-teal-500 to-cyan-400',
    glow: 'bg-teal-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Track patient outcomes over time with mood scores, goal completion, and session trends.',
    gradient: 'from-green-500 to-teal-500',
    glow: 'bg-green-500/20',
    span: 'md:col-span-1',
  },
  {
    icon: MessageSquare,
    title: 'Secure Messaging',
    description: 'HIPAA-compliant messaging with patients between sessions. No personal email or WhatsApp needed.',
    gradient: 'from-cyan-500 to-sky-500',
    glow: 'bg-cyan-500/20',
    span: 'md:col-span-1',
  },
]

export function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section ref={ref} id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.05),transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything your practice{' '}
            <span className="gradient-text">needs</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            A complete toolkit for solo practitioners — from first booking to final invoice, all in one place.
          </p>
        </motion.div>

        <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`group relative p-6 rounded-2xl border border-white/5 bg-white/[2%] hover:bg-white/[4%] transition-all duration-300 overflow-hidden ${feature.span}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl ${feature.glow}`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
