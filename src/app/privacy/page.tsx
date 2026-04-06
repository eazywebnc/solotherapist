import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050508] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300 mb-8 block">&larr; Back</Link>
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-sm">
          <p className="text-zinc-400">Last updated: April 2026</p>
          <p className="text-zinc-400">SoloTherapist by EazyWebNC collects and processes call data to provide practice management services. Your data is stored securely on Supabase and is never shared with third parties without consent. Contact: contact@eazyweb.nc</p>
        </div>
      </div>
    </div>
  )
}
