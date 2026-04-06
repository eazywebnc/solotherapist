'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030808] px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Solo<span className="gradient-text">Therapist</span>
          </span>
        </Link>

        <div className="p-8 rounded-2xl border border-white/10 bg-white/[2%] backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-zinc-500 text-center mb-8">
            {isSignUp ? 'Start your 14-day free trial' : 'Sign in to your practice dashboard'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25"
                  placeholder="you@practice.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/25"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {message && (
              <p className={`text-xs text-center ${message.includes('Check') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium text-sm hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create account' : 'Sign in'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-zinc-500 text-center mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
              className="text-teal-400 hover:text-teal-300 font-medium"
            >
              {isSignUp ? 'Sign in' : 'Sign up free'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
