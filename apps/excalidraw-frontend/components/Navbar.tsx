
'use client';

import { useState, useEffect } from 'react';
import { PenTool, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
    const Router= useRouter();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'Shortcuts', href: '#shortcuts' },
    { label: 'Community', href: '#community' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/95 backdrop-blur-md shadow-sm border-b border-ink/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center transition-transform group-hover:rotate-6">
            <PenTool className="w-5 h-5 text-paper" strokeWidth={2.5} />
          </div>
          <span className="font-hand text-2xl font-bold text-ink">
            Sketchwai
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-light hover:text-ink transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-orange transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Desktop authentication buttons */}
        <div className="hidden md:flex items-center gap-3">
         <Link href={"/signin"}><button
            className="px-4 py-2 text-sm font-semibold text-ink hover:text-accent-orange transition-colors"
          >
            Sign in
          </button>
        </Link> 
        <Link href={"/signup"}>
          <button
            className="px-5 py-2.5 text-sm font-semibold text-paper bg-ink rounded-lg hover:bg-ink-light transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Sign up
          </button>
          </Link>
        </div>

        

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="md:hidden bg-paper border-t border-ink/10 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-ink-light hover:text-ink py-2"
            >
              {link.label}
            </a>
          ))}

          <div className="flex flex-col gap-2 pt-2 border-t border-ink/10">
            <a
              href="/signin"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-2.5 text-sm font-semibold text-ink border border-ink/15 rounded-lg hover:bg-ink/5"
            >
              Sign in
            </a>

            <a
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-2.5 text-sm font-semibold text-paper bg-ink rounded-lg hover:bg-ink-light"
            >
              Sign up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
