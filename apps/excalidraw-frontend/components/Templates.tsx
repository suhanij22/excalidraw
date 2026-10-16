"use client";

import { useState } from 'react';

const templates = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    category: 'Diagrams',
    svg: (
      <svg viewBox="0 0 200 140" className="w-full h-full">
        <rect x="20" y="15" width="70" height="35" rx="6" fill="none" stroke="#1e2231" strokeWidth="2" />
        <path d="M 90 32 Q 110 32 120 32" fill="none" stroke="#f97316" strokeWidth="2" markerEnd="url(#fa)" />
        <path d="M 155 50 L 155 75 L 100 75 L 100 90" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#fa)" />
        <path d="M 140 32 L 170 32 L 170 75 L 155 75" fill="none" stroke="#1e2231" strokeWidth="2" />
        <rect x="65" y="90" width="70" height="35" rx="6" fill="none" stroke="#1e2231" strokeWidth="2" />
        <defs><marker id="fa" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#1e2231" /></marker></defs>
      </svg>
    ),
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    category: 'Design',
    svg: (
      <svg viewBox="0 0 200 140" className="w-full h-full">
        <rect x="15" y="10" width="170" height="120" rx="6" fill="none" stroke="#1e2231" strokeWidth="2" />
        <rect x="15" y="10" width="170" height="22" rx="6" fill="#1e2231" opacity="0.08" />
        <circle cx="27" cy="21" r="3" fill="none" stroke="#1e2231" strokeWidth="1.5" />
        <circle cx="37" cy="21" r="3" fill="none" stroke="#1e2231" strokeWidth="1.5" />
        <rect x="28" y="45" width="65" height="40" rx="4" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <line x1="28" y1="100" x2="80" y2="100" stroke="#8b909f" strokeWidth="1.5" />
        <line x1="28" y1="110" x2="65" y2="110" stroke="#8b909f" strokeWidth="1.5" />
        <rect x="105" y="45" width="65" height="70" rx="4" fill="none" stroke="#ec4899" strokeWidth="2" />
        <line x1="115" y1="60" x2="160" y2="60" stroke="#8b909f" strokeWidth="1.5" />
        <line x1="115" y1="72" x2="150" y2="72" stroke="#8b909f" strokeWidth="1.5" />
        <rect x="115" y="85" width="40" height="18" rx="3" fill="#f97316" opacity="0.2" stroke="#f97316" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'mindmap',
    name: 'Mind Map',
    category: 'Brainstorming',
    svg: (
      <svg viewBox="0 0 200 140" className="w-full h-full">
        <circle cx="100" cy="70" r="22" fill="none" stroke="#1e2231" strokeWidth="2.5" />
        <text x="100" y="74" textAnchor="middle" fontSize="10" fill="#1e2231" className="font-hand">Idea</text>
        <path d="M 78 70 Q 55 70 45 35" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <path d="M 78 70 Q 55 70 45 105" fill="none" stroke="#10b981" strokeWidth="2" />
        <path d="M 122 70 Q 145 70 155 35" fill="none" stroke="#f97316" strokeWidth="2" />
        <path d="M 122 70 Q 145 70 155 105" fill="none" stroke="#ec4899" strokeWidth="2" />
        <circle cx="35" cy="30" r="14" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="35" cy="110" r="14" fill="none" stroke="#10b981" strokeWidth="2" />
        <circle cx="165" cy="30" r="14" fill="none" stroke="#f97316" strokeWidth="2" />
        <circle cx="165" cy="110" r="14" fill="none" stroke="#ec4899" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'arch',
    name: 'Architecture',
    category: 'Engineering',
    svg: (
      <svg viewBox="0 0 200 140" className="w-full h-full">
        <rect x="20" y="20" width="50" height="30" rx="4" fill="none" stroke="#1e2231" strokeWidth="2" />
        <rect x="75" y="20" width="50" height="30" rx="4" fill="none" stroke="#3b82f6" strokeWidth="2" />
        <rect x="130" y="20" width="50" height="30" rx="4" fill="none" stroke="#1e2231" strokeWidth="2" />
        <path d="M 70 35 L 75 35 M 125 35 L 130 35" stroke="#8b909f" strokeWidth="2" />
        <rect x="75" y="70" width="50" height="30" rx="4" fill="none" stroke="#10b981" strokeWidth="2" />
        <path d="M 100 50 L 100 70" stroke="#8b909f" strokeWidth="2" />
        <rect x="20" y="70" width="50" height="30" rx="4" fill="none" stroke="#f97316" strokeWidth="2" />
        <path d="M 45 50 L 45 60 L 100 60 L 100 70 M 100 60 L 155 60 L 155 70" fill="none" stroke="#8b909f" strokeWidth="1.5" strokeDasharray="4 3" />
        <rect x="130" y="70" width="50" height="30" rx="4" fill="none" stroke="#ec4899" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function Templates() {
  const [active, setActive] = useState(0);

  return (
    <section id="templates" className="py-24 bg-paper relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-hand text-2xl text-accent-blue mb-2">start in seconds</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-balance">
            Templates for every kind of thinking
          </h2>
          <p className="mt-4 text-lg text-ink-light">
            Skip the blank page. Pick a template and start filling in your ideas.
          </p>
        </div>

        {/* Template tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {templates.map((tpl, i) => (
            <button
              key={tpl.id}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === i
                  ? 'bg-ink text-paper shadow-lg'
                  : 'bg-white text-ink-light border border-ink/8 hover:border-ink/20'
              }`}
            >
              {tpl.name}
            </button>
          ))}
        </div>

        {/* Active template preview */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-ink/8 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-ink/8 bg-paper-warm/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <span className="ml-3 text-xs text-ink-soft font-medium">
                {templates[active].name} — {templates[active].category}
              </span>
            </div>
            {/* Canvas */}
            <div className="relative h-72 bg-dots bg-paper-warm/20 p-8 flex items-center justify-center">
              <div key={active} className="w-full max-w-md animate-pop-in">
                {templates[active].svg}
              </div>
            </div>
          </div>
          <p className="text-center mt-6 text-ink-soft text-sm">
            Click a template tab above to preview it
          </p>
        </div>
      </div>
    </section>
  );
}
