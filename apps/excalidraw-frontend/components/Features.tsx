import { Users, Zap, Share2, Download, Keyboard, Palette } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Real-time collaboration',
    description: 'Draw together with your team in real-time. See cursors, selections, and edits as they happen.',
    color: 'blue',
  },
  {
    icon: Zap,
    title: 'Lightning fast',
    description: 'Opens in a blink. No account needed to start. Your canvas loads instantly, every time.',
    color: 'orange',
  },
  {
    icon: Palette,
    title: 'Hand-drawn aesthetic',
    description: 'Every stroke has the imperfect, organic feel of pen on paper. Charts and shapes that feel human.',
    color: 'pink',
  },
  {
    icon: Share2,
    title: 'Share with a link',
    description: 'Send a single link and anyone can view or edit. No signups, no downloads, no friction.',
    color: 'green',
  },
  {
    icon: Download,
    title: 'Export anywhere',
    description: 'Export to PNG, SVG, or embed code. Your drawings go wherever your docs live.',
    color: 'blue',
  },
  {
    icon: Keyboard,
    title: 'Keyboard-first',
    description: 'Every tool is one keystroke away. Stay in flow with shortcuts for everything.',
    color: 'orange',
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-accent-blue/10', text: 'text-accent-blue', border: 'hover:border-accent-blue/30' },
  orange: { bg: 'bg-accent-orange/10', text: 'text-accent-orange', border: 'hover:border-accent-orange/30' },
  pink: { bg: 'bg-accent-pink/10', text: 'text-accent-pink', border: 'hover:border-accent-pink/30' },
  green: { bg: 'bg-accent-green/10', text: 'text-accent-green', border: 'hover:border-accent-green/30' },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-paper-cool relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-hand text-2xl text-accent-orange mb-2">why you'll love it</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-ink text-balance">
            Everything you need to sketch ideas
          </h2>
          <p className="mt-4 text-lg text-ink-light">
            A whiteboard that gets out of your way. No clutter, no learning curve —
            just you and your thoughts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const c = colorMap[feature.color];
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`group bg-white rounded-2xl p-7 border border-ink/8 ${c.border} transition-all hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${c.text}`} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-ink-light leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
