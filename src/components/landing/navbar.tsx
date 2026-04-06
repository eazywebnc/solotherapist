'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030808]/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-shadow">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold">
            Solo<span className="gradient-text">Therapist</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link href="/auth/login" className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25">
            Start free
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-zinc-400" aria-label="Menu">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030808]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 space-y-3"
          >
            <a href="#features" className="block text-sm text-zinc-400">Features</a>
            <a href="#how-it-works" className="block text-sm text-zinc-400">How it works</a>
            <a href="#pricing" className="block text-sm text-zinc-400">Pricing</a>
            <Link href="/auth/login" className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium">
              Start free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
