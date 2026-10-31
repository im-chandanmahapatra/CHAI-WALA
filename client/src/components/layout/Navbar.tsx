import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingBag, Flame, Coffee, Sparkles, Menu as MenuIcon, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { AnimatedWordmark } from '../brand/AnimatedWordmark';
import { MoodSlug } from '../../lib/database.types';

export const Navbar: React.FC = () => {
  const { mood, setMood, moodName } = useTheme();
  const { itemCount, subtotalPaise, setIsCartOpen } = useCart();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moodDropdownOpen, setMoodDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoodDropdownOpen(false);
  }, [location.pathname]);

  const moods: { slug: MoodSlug; label: string; hindi: string; icon: React.ReactNode; desc: string }[] = [
    { slug: 'adda', label: 'Classic Adda', hindi: 'सवेरा', icon: <Flame className="w-4 h-4 text-[#9E3D24]" />, desc: 'Cutting Chai & Bun Maska' },
    { slug: 'classics', label: 'Café Classics', hindi: 'दोपहर', icon: <Coffee className="w-4 h-4 text-[#683C54]" />, desc: 'Filter Coffee & Toasties' },
    { slug: 'lab', label: 'Trend Lab', hindi: 'शाम', icon: <Sparkles className="w-4 h-4 text-[#445932]" />, desc: 'Matcha Drops & Cold Brew' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-panel border-b border-[var(--border)] shadow-sm py-2.5'
            : 'bg-[var(--bg)] border-b border-[var(--border-subtle)] py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Animated Brand Identity */}
          <div className="flex items-center gap-8">
            <AnimatedWordmark />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/menu"
                className={`text-xs uppercase font-bold tracking-widest transition-colors ${
                  location.pathname === '/menu'
                    ? 'text-[var(--primary)] font-black'
                    : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'
                }`}
              >
                Full Menu
              </Link>
              <a
                href="/#three-moods"
                className="text-xs uppercase font-bold tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
              >
                The 3 Atmospheres
              </a>
              <a
                href="/#craft-ritual"
                className="text-xs uppercase font-bold tracking-widest text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
              >
                Brewing Ritual
              </a>
            </nav>
          </div>

          {/* Right: Mood Curator & Cart Trigger */}
          <div className="flex items-center gap-3">
            {/* Atmosphere Switcher Dropdown (Desktop) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setMoodDropdownOpen(!moodDropdownOpen)}
                className="px-3.5 py-2 bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--border)] rounded-full text-xs font-bold text-[var(--ink)] flex items-center gap-2 shadow-stamp transition-all cursor-pointer"
                aria-label="Select atmosphere mood"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">Mood:</span>
                <span className="font-display font-bold text-[var(--primary)]">{moodName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--ink-muted)] transition-transform duration-200 ${moodDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {moodDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-card p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--ink-muted)] block">
                        Atmospheric Lenses
                      </span>
                      <p className="text-[11px] text-[var(--ink-muted)] leading-tight mt-0.5">
                        Switching mood highlights curated flights while keeping the entire menu accessible.
                      </p>
                    </div>

                    <div className="space-y-1">
                      {moods.map((m) => {
                        const active = mood === m.slug;
                        return (
                          <button
                            key={m.slug}
                            onClick={() => {
                              setMood(m.slug);
                              setMoodDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                              active
                                ? 'bg-[var(--mood-bg-subtle)] border border-[var(--primary)]/30'
                                : 'hover:bg-[var(--surface-subtle)]'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] shadow-stamp flex-shrink-0 mt-0.5">
                              {m.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-display font-bold text-xs text-[var(--ink)]">
                                  {m.label}
                                </span>
                                <span className="font-devanagari text-[10px] font-bold text-[var(--primary)]">
                                  {m.hindi}
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--ink-muted)] line-clamp-1 mt-0.5">
                                {m.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Trigger Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full font-bold text-xs flex items-center gap-2.5 shadow-stamp transition-colors cursor-pointer"
              aria-label={`Open order bag with ${itemCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={itemCount}
                    className="absolute -top-1.5 -right-2 bg-[var(--brass)] text-[var(--ink)] text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </div>
              <span className="hidden sm:inline font-display">Bag</span>
              {subtotalPaise > 0 && (
                <span className="hidden md:inline font-tabular text-white/90 font-medium border-l border-white/20 pl-2">
                  ₹{(subtotalPaise / 100).toFixed(0)}
                </span>
              )}
            </motion.button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[var(--ink)] hover:text-[var(--primary)] focus:outline-none rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="lg:hidden bg-[var(--surface)] border-b border-[var(--border)] px-4 pt-3 pb-6 mt-2 space-y-4 overflow-hidden shadow-card"
            >
              <nav className="flex flex-col space-y-2 pt-1 border-b border-[var(--border-subtle)] pb-3">
                <Link
                  to="/menu"
                  className="px-3 py-2 rounded-lg font-display font-bold text-sm text-[var(--ink)] hover:bg-[var(--surface-subtle)]"
                >
                  Full Menu & Ordering ↗
                </Link>
                <a
                  href="/#three-moods"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)]"
                >
                  The Three Atmospheres
                </a>
                <a
                  href="/#craft-ritual"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)]"
                >
                  Our Brewing Ritual
                </a>
              </nav>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--ink-muted)] block px-1 mb-2">
                  Active Atmosphere:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {moods.map((m) => {
                    const active = mood === m.slug;
                    return (
                      <button
                        key={m.slug}
                        onClick={() => {
                          setMood(m.slug);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                          active
                            ? 'bg-[var(--mood-bg-subtle)] border-[var(--primary)] text-[var(--primary)] shadow-stamp'
                            : 'bg-[var(--surface)] border-[var(--border)] text-[var(--ink-muted)]'
                        }`}
                      >
                        {m.icon}
                        <span className="font-display font-bold text-[11px] leading-tight">
                          {m.label.split(' ')[0]}
                        </span>
                        <span className="font-devanagari text-[9px] opacity-80">{m.hindi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
