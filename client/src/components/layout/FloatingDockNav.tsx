import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import {
  ShoppingBag,
  Flame,
  Coffee,
  Sparkles,
  Compass,
  ChevronUp,
  X,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { MoodSlug } from '../../lib/database.types';
import { SanctuaryAudioPlayer } from '../audio/SanctuaryAudioPlayer';

export const FloatingDockNav: React.FC = () => {
  const { mood, setMood, moodName } = useTheme();
  const { itemCount, setIsCartOpen } = useCart();
  const location = useLocation();

  const [atmosphereMenuOpen, setAtmosphereMenuOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const atmospheres: {
    slug: MoodSlug;
    label: string;
    hindi: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      slug: 'adda',
      label: 'Classic Adda',
      hindi: 'सवेरा',
      icon: <Flame className="w-4 h-4 text-[#9E3D24]" />,
      desc: 'Cutting Chai & Bun Maska',
    },
    {
      slug: 'classics',
      label: 'Café Classics',
      hindi: 'दोपहर',
      icon: <Coffee className="w-4 h-4 text-[#C8963E]" />,
      desc: 'Filter Coffee & Toasties',
    },
    {
      slug: 'lab',
      label: 'Trend Lab',
      hindi: 'शाम',
      icon: <Sparkles className="w-4 h-4 text-[#2E7D32]" />,
      desc: 'Matcha Drops & Cold Brew',
    },
  ];

  return (
    <>
      {/* ========================================================
          DESKTOP FLOATING LIQUID-GLASS DOCK (>= 768px)
      ======================================================== */}
      <nav
        aria-label="Bottom Quick Navigation"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-2 p-2 bg-[var(--parchment)]/90 backdrop-blur-md border border-[var(--warm-border)] rounded-full shadow-[var(--shadow-warm-lg)] text-[var(--dark-roast)]"
      >
        {/* Brand Home Icon */}
        <Link
          to="/"
          className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
            location.pathname === '/'
              ? 'bg-[var(--linen)] text-[var(--terracotta)] font-bold'
              : 'text-[var(--clay)] hover:text-[var(--dark-roast)] hover:bg-[var(--linen)]'
          }`}
          title="Sanctuary Home"
        >
          <div className="w-5 h-5 rounded-full bg-[var(--terracotta)] text-white flex items-center justify-center font-serif text-[11px] font-bold">
            च
          </div>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-[var(--warm-border)] mx-0.5" />

        {/* Atmosphere Selector Pill */}
        <div className="relative">
          <button
            onClick={() => setAtmosphereMenuOpen(!atmosphereMenuOpen)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 bg-[var(--linen)] border border-[var(--warm-border)] hover:border-[var(--terracotta)]/40 transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--terracotta)] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-[var(--clay)]">Atmosphere:</span>
            <span className="font-serif font-bold text-[var(--dark-roast)]">{moodName}</span>
            <ChevronUp
              className={`w-3.5 h-3.5 text-[var(--clay)] transition-transform duration-200 ${
                atmosphereMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Atmosphere Dropdown Sheet */}
          <AnimatePresence>
            {atmosphereMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full mb-3 left-0 w-64 bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-2 shadow-[var(--shadow-warm-lg)] space-y-1 z-50"
              >
                <div className="px-3 py-1.5 border-b border-[var(--warm-border)] text-[10px] uppercase font-bold tracking-widest text-[var(--clay)]">
                  Select Discovery Flight
                </div>
                {atmospheres.map((atm) => (
                  <button
                    key={atm.slug}
                    onClick={() => {
                      setMood(atm.slug);
                      setAtmosphereMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      mood === atm.slug
                        ? 'bg-[var(--linen)] border border-[var(--warm-border)]'
                        : 'hover:bg-[var(--linen)]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[var(--parchment)] border border-[var(--warm-border)]">
                        {atm.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-xs text-[var(--dark-roast)]">
                            {atm.label}
                          </span>
                          <span className="text-[10px] text-[var(--clay)] font-devanagari">
                            ({atm.hindi})
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--clay)]">{atm.desc}</p>
                      </div>
                    </div>
                    {mood === atm.slug && (
                      <Check className="w-4 h-4 text-[var(--terracotta)]" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu Catalogue Link */}
        <Link
          to="/menu"
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            location.pathname === '/menu'
              ? 'bg-[var(--terracotta)] text-white shadow-xs'
              : 'text-[var(--clay)] hover:text-[var(--dark-roast)] hover:bg-[var(--linen)]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Menu</span>
        </Link>

        {/* Ambient Soundtrack Player */}
        <SanctuaryAudioPlayer />

        {/* Divider */}
        <div className="h-5 w-px bg-[var(--warm-border)] mx-0.5" />

        {/* Persistent Cart Bag Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--linen)] hover:bg-[var(--sand)] border border-[var(--warm-border)] flex items-center gap-2 transition-all cursor-pointer"
          title="Open Order Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-3.5 h-3.5 text-[var(--terracotta)]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--terracotta)] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {itemCount}
              </span>
            )}
          </div>
          <span className="font-serif font-bold text-[var(--dark-roast)]">Bag</span>
        </button>

        {/* Direct Order Ahead Action */}
        <Link
          to="/checkout"
          className="px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--terracotta)] text-white hover:bg-[#85321D] transition-all flex items-center gap-1 shadow-xs"
        >
          <span>Order Ahead</span>
        </Link>
      </nav>

      {/* ========================================================
          MOBILE FLOATING PILL (< 768px)
      ======================================================== */}
      {!mobileSheetOpen && (
        <div className="fixed bottom-4 inset-x-4 z-40 md:hidden flex items-center justify-between p-2 bg-[var(--parchment)] border border-[var(--warm-border-strong)] rounded-full shadow-[var(--shadow-warm-lg)] text-[var(--dark-roast)]">
          <Link to="/" className="flex items-center gap-2 pl-2">
            <div className="w-7 h-7 rounded-full bg-[var(--terracotta)] text-white flex items-center justify-center font-serif text-xs font-bold">
              च
            </div>
            <span className="font-serif font-bold text-xs tracking-tight">CHAIWALA</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Audio Player in mobile bar */}
            <SanctuaryAudioPlayer />

            {/* Quick Menu Button */}
            <Link
              to="/menu"
              className="px-3 py-1.5 rounded-full bg-[var(--linen)] border border-[var(--warm-border)] text-xs font-semibold text-[var(--dark-roast)]"
            >
              Menu
            </Link>

            {/* Cart Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full bg-[var(--terracotta)] text-white"
              aria-label="Open Order Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--brass)] text-[var(--dark-roast)] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Expand Menu Toggle */}
            <button
              onClick={() => setMobileSheetOpen(true)}
              className="p-2 rounded-full border border-[var(--warm-border)] text-[var(--clay)]"
              aria-label="Expand Atmosphere & Controls"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Expandable Sheet */}
      <AnimatePresence>
        {mobileSheetOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-[var(--parchment)] border-t border-[var(--warm-border)] rounded-t-3xl p-6 pb-12 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--warm-border)] pb-3">
                <span className="font-serif font-bold text-base text-[var(--dark-roast)]">
                  Chaiwala Sanctuaries
                </span>
                <button
                  onClick={() => setMobileSheetOpen(false)}
                  className="p-2 rounded-full text-[var(--clay)] hover:text-[var(--dark-roast)]"
                  aria-label="Close Sanctuaries Sheet"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Atmosphere Selection */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--clay)]">
                  Atmospheric Flights
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {atmospheres.map((atm) => (
                    <button
                      key={atm.slug}
                      onClick={() => {
                        setMood(atm.slug);
                        setMobileSheetOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        mood === atm.slug
                          ? 'bg-[var(--linen)] border-[var(--terracotta)] font-semibold'
                          : 'bg-[var(--parchment)] border-[var(--warm-border)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[var(--parchment)] border border-[var(--warm-border)]">
                          {atm.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-sm text-[var(--dark-roast)]">
                              {atm.label}
                            </span>
                            <span className="text-xs text-[var(--clay)] font-devanagari">
                              ({atm.hindi})
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--clay)]">{atm.desc}</p>
                        </div>
                      </div>
                      {mood === atm.slug && (
                        <Check className="w-4 h-4 text-[var(--terracotta)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-2 border-t border-[var(--warm-border)] flex flex-col gap-2">
                <Link
                  to="/menu"
                  onClick={() => setMobileSheetOpen(false)}
                  className="w-full py-3 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-center text-xs font-bold text-[var(--dark-roast)]"
                >
                  Explore Complete 19-Recipe Menu
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setMobileSheetOpen(false)}
                  className="w-full py-3 bg-[var(--terracotta)] text-white rounded-xl text-center text-xs font-bold shadow-xs"
                >
                  Proceed to 15-Min Slot Checkout
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
