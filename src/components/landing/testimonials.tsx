"use client";

const testimonials = [
  {
    quote: "Running a solo practice means wearing every hat. SoloTherapist handles my scheduling, session notes reminders, and billing in one place. I reclaimed 6 hours a week of admin time and can finally focus entirely on my clients.",
    name: "Dr. Claire Beaumont",
    role: "Licensed Clinical Psychologist, Private Practice",
    initials: "CB",
  },
  {
    quote: "The secure client portal is a game-changer. Clients complete intake forms before our first session, which means we can dive straight into therapeutic work. My onboarding experience went from clunky to completely seamless overnight.",
    name: "James Whitfield, LPC",
    role: "Individual & Couples Therapist",
    initials: "JW",
  },
  {
    quote: "I switched from three different tools — a calendar, a notes app, and a separate billing system — to just SoloTherapist. Everything talks to each other, HIPAA compliance is built in, and my stress around admin has dropped dramatically.",
    name: "Ren Nakashima, LCSW",
    role: "Trauma Specialist, Solo Practice",
    initials: "RN",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          Trusted by Industry Leaders
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-2xl mx-auto">
          See what our customers have to say about their experience.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-300 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-zinc-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
