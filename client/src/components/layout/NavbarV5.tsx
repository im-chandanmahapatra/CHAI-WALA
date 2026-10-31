import React, { useState } from 'react';
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
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { MoodSlug } from '../../lib/database.types';
import { SanctuaryAudioPlayer } from '../audio/SanctuaryAudioPlayer';
import { useCursor } from '../../hooks/useCursorContext';

export const NavbarV5: React.FC = () => {
  const { mood, setMood, moodName } = useTheme();
  const { itemCount, setIsCartOpen } = useCart();
  const { setCursorVariant } = useCursor();
  const location = useLocation();

  const [atmosphereMenuOpen, setAtmosphereMenuOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Hide completely on checkout, tracking chit, and admin routes
  const isHiddenRoute =
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/order') ||
    location.pathname.startsWith('/admin');

  if (isHiddenRoute) {
    return null;
  }

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
      icon: <Flame className="w-4 h-4 text-[#E8A24A]" />,
      desc: 'Cutting Chai & Bun Maska',
    },
    {
      slug: 'classics',
      label: 'Café Classics',
      hindi: 'दोपहर',
      icon: <Coffee className="w-4 h-4 text-[#D4A054]" />,
      desc: 'Filter Coffee & Toasties',
    },
    {
      slug: 'lab',
      label: 'Trend Lab',
      hindi: 'शाम',
      icon: <Sparkles className="w-4 h-4 text-[#7C9A5E]" />,
      desc: 'Matcha Drops & Cold Brew',
    },
  ];

  return (
    <>
      {/* ========================================================
          DESKTOP FLOATING LIQUID-GLASS DOCK (>= 768px)
      ======================================================== */}
      <nav
        aria-label="V5 Sanctuary Liquid Navigation Dock"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-2 p-2 bg-[#0E0A07]/90 backdrop-blur-2xl border border-white/[0.12] rounded-full shadow-[0_16px_48px_rgba(0,0,0,0.8)] text-[#F6EBDD]"
      >
        {/* Brand Home Mark */}
        <Link
          to="/"
          onMouseEnter={() => setCursorVariant('pointer')}
          onMouseLeave={() => setCursorVariant('default')}
          className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
            location.pathname === '/'
              ? 'bg-[#E8A24A]/20 text-[#E8A24A]'
              : 'text-[#BFAE9A] hover:text-[#F6EBDD] hover:bg-white/[0.06]'
          }`}
          title="Home"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9E3D24] to-[#E8A24A] text-[#0E0A07] flex items-center justify-center font-devanagari text-xs font-bold shadow-sm">
            च
          </div>
        </Link>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-white/[0.12]" />

        {/* Atmosphere Flight Selector */}
        <div className="relative">
          <button
            onClick={() => setAtmosphereMenuOpen(!atmosphereMenuOpen)}
            onMouseEnter={() => setCursorVariant('pointer')}
            onMouseLeave={() => setCursorVariant('default')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/[0.06] transition-all text-xs font-medium text-[#F6EBDD]"
            aria-expanded={atmosphereMenuOpen}
            aria-label="Toggle Atmosphere Flight"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8A24A] animate-pulse" />
            <span className="font-semibold">{moodName}</span>
            <ChevronUp
              className={`w-3.5 h-3.5 text-[#BFAE9A] transition-transform duration-200 ${
                atmosphereMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Atmosphere Dropdown Menu */}
          <AnimatePresence>
            {atmosphereMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-full left-0 mb-3 w-64 bg-[#17100B] border border-white/[0.12] rounded-2xl p-2 shadow-2xl backdrop-blur-2xl z-50"
              >
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[#7E6F60] border-b border-white/[0.06]">
                  Select Atmosphere
                </div>
                <div className="space-y-1 mt-1">
                  {atmospheres.map((atm) => (
                    <button
                      key={atm.slug}
                      onClick={() => {
                        setMood(atm.slug);
                        setAtmosphereMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all text-xs ${
                        mood === atm.slug
                          ? 'bg-[#E8A24A]/15 text-[#E8A24A] font-bold'
                          : 'text-[#F6EBDD] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1 rounded-lg bg-white/[0.05]">{atm.icon}</div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">{atm.label}</span>
                            <span className="text-[10px] opacity-60 font-devanagari">
                              ({atm.hindi})
                            </span>
                          </div>
                          <div className="text-[10px] text-[#7E6F60]">{atm.desc}</div>
                        </div>
                      </div>
                      {mood === atm.slug && <Check className="w-3.5 h-3.5 text-[#E8A24A]" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Menu Navigation Link */}
        <Link
          to="/menu"
          onMouseEnter={() => setCursorVariant('pointer')}
          onMouseLeave={() => setCursorVariant('default')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            location.pathname === '/menu'
              ? 'bg-[#E8A24A]/15 text-[#E8A24A]'
              : 'text-[#BFAE9A] hover:text-[#F6EBDD] hover:bg-white/[0.06]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Full Menu</span>
        </Link>

        {/* About Page Link */}
        <Link
          to="/about"
          onMouseEnter={() => setCursorVariant('pointer')}
          onMouseLeave={() => setCursorVariant('default')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            location.pathname === '/about'
              ? 'bg-[#E8A24A]/15 text-[#E8A24A]'
              : 'text-[#BFAE9A] hover:text-[#F6EBDD] hover:bg-white/[0.06]'
          }`}
        >
          <span>Story</span>
        </Link>

        {/* Contact Page Link */}
        <Link
          to="/contact"
          onMouseEnter={() => setCursorVariant('pointer')}
          onMouseLeave={() => setCursorVariant('default')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
            location.pathname === '/contact'
              ? 'bg-[#E8A24A]/15 text-[#E8A24A]'
              : 'text-[#BFAE9A] hover:text-[#F6EBDD] hover:bg-white/[0.06]'
          }`}
        >
          <span>Visit</span>
        </Link>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-white/[0.12]" />

        {/* Ambient Sanctuary Audio Player */}
        <div className="px-1">
          <SanctuaryAudioPlayer />
        </div>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-white/[0.12]" />

        {/* Order Ahead CTA */}
        <Link
          to="/menu"
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="relative group overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-[#E8A24A] to-[#F5B563] text-[#0E0A07] text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(232,162,74,0.3)] hover:shadow-[0_4px_22px_rgba(232,162,74,0.5)] transition-all flex items-center gap-1.5"
        >
          <span className="relative z-10 flex items-center gap-1">
            Order Ahead
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
        </Link>

        {/* Cart Bag Icon with Live Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="relative p-2.5 rounded-full text-[#F6EBDD] hover:bg-white/[0.08] transition-all cursor-pointer"
          aria-label={`Cart contains ${itemCount} items`}
        >
          <ShoppingBag className="w-4 h-4 text-[#F6EBDD]" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#E8A24A] text-[#0E0A07] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-scale">
              {itemCount}
            </span>
          )}
        </button>
      </nav>

      {/* ========================================================
          MOBILE BOTTOM FLOATING PILL (< 768px)
      ======================================================== */}
      {!mobileSheetOpen && (
        <div className="fixed bottom-4 inset-x-4 z-50 md:hidden flex items-center justify-between p-2 bg-[#0E0A07]/95 backdrop-blur-xl border border-white/[0.12] rounded-full shadow-2xl text-[#F6EBDD]">
          {/* Logo Mark + Atmosphere button */}
          <button
            onClick={() => setMobileSheetOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/[0.08] transition-all text-xs"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#9E3D24] to-[#E8A24A] text-[#0E0A07] flex items-center justify-center font-devanagari text-[10px] font-bold">
              च
            </div>
            <span className="font-semibold text-xs">{moodName}</span>
            <ChevronUp className="w-3.5 h-3.5 text-[#BFAE9A]" />
          </button>

          {/* Quick Actions (Audio, Menu, Bag) */}
          <div className="flex items-center gap-1">
            <SanctuaryAudioPlayer />

            <Link
              to="/menu"
              className="px-3 py-1.5 rounded-full bg-[#E8A24A] text-[#0E0A07] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md"
            >
              Menu
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-[#F6EBDD] hover:bg-white/[0.08]"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E8A24A] text-[#0E0A07] font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MOBILE EXPANDABLE BOTTOM SHEET
      ======================================================== */}
      <AnimatePresence>
        {mobileSheetOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSheetOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Sheet Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="absolute inset-x-0 bottom-0 bg-[#17100B] border-t border-white/[0.12] rounded-t-3xl p-6 text-[#F6EBDD] pb-10 shadow-2xl"
            >
              {/* Handlebar & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9E3D24] to-[#E8A24A] text-[#0E0A07] flex items-center justify-center font-devanagari text-xs font-bold">
                    च
                  </div>
                  <span className="font-display font-bold text-base text-[#F6EBDD]">
                    CHAIWALA
                  </span>
                </div>
                <button
                  onClick={() => setMobileSheetOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/[0.08] text-[#BFAE9A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Atmosphere Switcher */}
              <div className="py-4 space-y-2">
                <span className="text-[11px] font-mono uppercase text-[#7E6F60] tracking-wider">
                  Select Atmospheric Mood
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {atmospheres.map((atm) => (
                    <button
                      key={atm.slug}
                      onClick={() => {
                        setMood(atm.slug);
                        setMobileSheetOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        mood === atm.slug
                          ? 'bg-[#E8A24A]/15 border-[#E8A24A]/40 text-[#E8A24A]'
                          : 'bg-white/[0.03] border-white/[0.08] text-[#F6EBDD]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {atm.icon}
                        <div className="text-left">
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            <span>{atm.label}</span>
                            <span className="font-devanagari opacity-60 text-[10px]">
                              ({atm.hindi})
                            </span>
                          </div>
                          <div className="text-[10px] text-[#7E6F60]">{atm.desc}</div>
                        </div>
                      </div>
                      {mood === atm.slug && <Check className="w-4 h-4 text-[#E8A24A]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.08]">
                <Link
                  to="/menu"
                  onClick={() => setMobileSheetOpen(false)}
                  className="p-3 rounded-xl bg-white/[0.04] text-center text-xs font-semibold text-[#F6EBDD]"
                >
                  Full Menu
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileSheetOpen(false)}
                  className="p-3 rounded-xl bg-white/[0.04] text-center text-xs font-semibold text-[#F6EBDD]"
                >
                  Our Story
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileSheetOpen(false)}
                  className="p-3 rounded-xl bg-white/[0.04] text-center text-xs font-semibold text-[#F6EBDD]"
                >
                  Contact
                </Link>
              </div>

              {/* Order Ahead Big CTA */}
              <div className="pt-4">
                <Link
                  to="/menu"
                  onClick={() => setMobileSheetOpen(false)}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E8A24A] to-[#F5B563] text-[#0E0A07] text-center font-bold text-xs uppercase tracking-wider block shadow-lg"
                >
                  Browse Menu & Order Ahead
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
