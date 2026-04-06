import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">SoloTherapist</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:contact@eazyweb.nc" className="hover:text-white transition-colors">Contact</a>
          </div>

          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} EazyWebNC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
