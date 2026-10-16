import { PenTool, Heart } from 'lucide-react';

export default function Footer() {
  const columns = [
    {
      title: 'Product',
      links: ['Features', 'Templates', 'Shortcuts', 'Changelog', 'Roadmap'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Blog', 'Tutorials', 'API', 'Community'],
    },
    {
      title: 'Company',
      links: ['About', 'Careers', 'Privacy', 'Terms', 'Contact'],
    },
  ];

  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-paper/10 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-paper" strokeWidth={2.5} />
              </div>
              <span className="font-hand text-2xl font-bold">Sketchwai</span>
            </div>
            <p className="text-sm text-paper/60 max-w-xs leading-relaxed">
              The virtual whiteboard for sketching hand-drawn-like diagrams.
              Open source, free, and made with care.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4 text-paper">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-paper/60 hover:text-paper transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-paper/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-paper/50">
            © 2026 Sketchwai. All rights reserved.
          </p>
          <p className="text-sm text-paper/50 flex items-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-accent-pink" /> and a lot of coffee
          </p>
        </div>
      </div>
    </footer>
  );
}
