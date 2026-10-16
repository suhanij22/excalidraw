import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section id="community" className="py-24 bg-paper-warm relative overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 bg-accent-blue/5 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-accent-orange/5 rounded-full blur-2xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ink/5 text-ink-light text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 text-accent-orange" />
          Free forever for individuals
        </div>

        <h2 className="text-5xl sm:text-6xl font-bold text-ink text-balance leading-tight">
          Ready to draw your
          <span className="font-hand text-accent-orange block">next big idea?</span>
        </h2>

        <p className="mt-6 text-lg text-ink-light max-w-xl mx-auto">
          No account needed. No credit card. Just open the canvas and start
          sketching. It's that simple.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-paper bg-ink rounded-xl hover:bg-ink-light transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Open the canvas
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-ink bg-transparent border-2 border-ink/15 rounded-xl hover:border-ink/30 transition-all"
          >
            Star on GitHub
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: '120K+', label: 'Active users' },
            { value: '4.9★', label: 'Product Hunt' },
            { value: '12K', label: 'GitHub stars' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-ink">{stat.value}</div>
              <div className="text-sm text-ink-soft mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
