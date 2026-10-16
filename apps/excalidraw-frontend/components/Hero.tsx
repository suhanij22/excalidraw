import { MousePointer2, ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 overflow-hidden bg-paper">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      {/* Gradient blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-accent-orange/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm font-medium mb-6 animate-fade-up opacity-init">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Now with real-time collaboration
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.1] text-balance animate-fade-up delay-100 opacity-init">
            Draw together,
            <br />
            <span className="font-hand text-accent-orange">think together.</span>
          </h1>

          <p className="mt-6 text-lg text-ink-light max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-up delay-200 opacity-init">
            The virtual whiteboard for sketching hand-drawn-like diagrams.
            Wireframes, flowcharts, mind maps — all with the warmth of pen on
            paper, right in your browser.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-up delay-300 opacity-init">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-paper bg-ink rounded-xl hover:bg-ink-light transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Start drawing
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-ink bg-transparent border-2 border-ink/15 rounded-xl hover:border-ink/30 transition-all"
            >
              <Play className="w-5 h-5" />
              Watch demo
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start animate-fade-up delay-400 opacity-init">
            <div className="flex -space-x-2">
              {['#3b82f6', '#10b981', '#f97316', '#ec4899'].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-paper flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: c }}
                >
                  {['JD', 'AK', 'MR', 'SL'][i]}
                </div>
              ))}
            </div>
            <div className="text-sm text-ink-soft">
              Loved by <span className="font-semibold text-ink">120,000+</span> creators
            </div>
          </div>
        </div>

        {/* Right: mock canvas */}
        <div className="relative animate-fade-up delay-300 opacity-init">
          <MockCanvas />
        </div>
      </div>
    </section>
  );
}

function MockCanvas() {
  return (
    <div className="relative">
      {/* Floating cursor badge */}
      <div className="absolute -top-4 -right-2 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue text-white text-xs font-medium rounded-lg shadow-lg animate-float-y">
        <MousePointer2 className="w-3.5 h-3.5" />
        Maya
      </div>
      <div className="absolute bottom-8 -left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-accent-pink text-white text-xs font-medium rounded-lg shadow-lg animate-float-y delay-500">
        <MousePointer2 className="w-3.5 h-3.5" />
        Alex
      </div>

      {/* Canvas card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-ink/8 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-ink/8 bg-paper-warm/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
          </div>
          <div className="ml-3 flex items-center gap-1">
            {['M', '▭', '○', '╱', 'T', '✎'].map((tool, i) => (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors ${
                  i === 5
                    ? 'bg-ink text-paper'
                    : 'text-ink-soft hover:bg-ink/5'
                }`}
              >
                {tool}
              </div>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-accent-blue border-2 border-white" />
              <div className="w-6 h-6 rounded-full bg-accent-pink border-2 border-white" />
            </div>
          </div>
        </div>

        {/* Drawing area */}
        <div className="relative h-80 bg-dots bg-paper-warm/30 p-6">
          <svg viewBox="0 0 500 320" className="w-full h-full">
            {/* Rectangle - "App" */}
            <rect
              x="20" y="20" width="120" height="60"
              rx="8" fill="none" stroke="#1e2231" strokeWidth="2.5"
              strokeDasharray="1000"
              className="animate-draw"
            />
            <text x="80" y="55" textAnchor="middle" className="font-hand" fontSize="20" fill="#1e2231">
              App
            </text>

            {/* Arrow */}
            <path
              d="M 140 50 Q 180 50 200 50" fill="none" stroke="#f97316"
              strokeWidth="2.5" markerEnd="url(#arrowhead)"
              strokeDasharray="1000"
              className="animate-draw delay-200"
            />

            {/* Diamond - "Auth?" */}
            <path
              d="M 250 20 L 300 50 L 250 80 L 200 50 Z" fill="none"
              stroke="#1e2231" strokeWidth="2.5"
              strokeDasharray="1000"
              className="animate-draw delay-300"
            />
            <text x="250" y="55" textAnchor="middle" className="font-hand" fontSize="16" fill="#1e2231">
              Auth?
            </text>

            {/* Arrow down */}
            <path
              d="M 250 80 Q 250 110 250 130" fill="none" stroke="#10b981"
              strokeWidth="2.5" markerEnd="url(#arrowhead2)"
              strokeDasharray="1000"
              className="animate-draw delay-400"
            />

            {/* Rectangle - "Dashboard" */}
            <rect
              x="190" y="130" width="120" height="60"
              rx="8" fill="none" stroke="#1e2231" strokeWidth="2.5"
              strokeDasharray="1000"
              className="animate-draw delay-500"
            />
            <text x="250" y="165" textAnchor="middle" className="font-hand" fontSize="18" fill="#1e2231">
              Dashboard
            </text>

            {/* Cloud shape - "Deploy" */}
            <path
              d="M 380 100 q -20 -30 -45 -15 q -25 -20 -40 10 q -25 5 -15 25 q 10 20 35 15 l 55 0 q 25 0 15 -25 q -5 -15 -20 -10 Z"
              fill="none" stroke="#3b82f6" strokeWidth="2.5"
              strokeDasharray="1000"
              className="animate-draw delay-700"
            />
            <text x="355" y="108" textAnchor="middle" className="font-hand" fontSize="16" fill="#3b82f6">
              Deploy
            </text>

            {/* Dashed arrow to cloud */}
            <path
              d="M 310 160 Q 350 130 360 120" fill="none" stroke="#8b909f"
              strokeWidth="2" strokeDasharray="6 4"
              markerEnd="url(#arrowhead3)"
            />

            {/* Hand-drawn scribble annotation */}
            <path
              d="M 30 220 Q 40 210 55 220 Q 70 230 80 220 Q 95 210 105 225"
              fill="none" stroke="#ec4899" strokeWidth="2.5"
              className="animate-draw delay-700"
            />
            <text x="60" y="250" className="font-hand" fontSize="18" fill="#ec4899">
              user flow!
            </text>

            {/* Arrowhead defs */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
              </marker>
              <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
              </marker>
              <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8b909f" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Decorative sticky note */}
      <div className="absolute -bottom-6 -right-6 w-36 -rotate-6 bg-accent-yellow/90 rounded-sm shadow-lg p-3 animate-float-y delay-300">
        <p className="font-hand text-ink text-sm leading-tight">
          "It feels just like a real whiteboard!"
        </p>
        <p className="font-hand-alt text-ink/60 text-xs mt-1">— happy user</p>
      </div>
    </div>
  );
}
