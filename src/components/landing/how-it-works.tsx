'use client'

import { motion } from 'framer-motion'
import { UserPlus, Users, CalendarCheck, Banknote } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Create your profile',
    description: 'Set up your practice profile, services, availability, and booking page in minutes.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
  },
  {
    icon: Users,
    title: 'Import your patients',
    description: 'Add existing patients manually or import via CSV. Their history, notes, and files all in one place.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: CalendarCheck,
    title: 'Start taking bookings',
    description: 'Share your booking link. Patients self-schedule, reminders go out automatically, and you\'re in control.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: Banknote,
    title: 'Get paid instantly',
    description: 'Send invoices with one click or enable auto-invoicing after each session. Accept cards, get paid fast.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Up and running in{' '}
            <span className="gradient-text">minutes</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Four simple steps to a fully organized practice.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-teal-500/20 to-transparent" />
              )}

              <div className={`w-16 h-16 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center mb-4`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>
              <div className="text-xs text-zinc-600 font-mono mb-2">Step {i + 1}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
