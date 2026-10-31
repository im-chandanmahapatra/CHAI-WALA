import React from 'react';
import { Link } from 'react-router';
import { Clock, MapPin, IndianRupee, ShieldCheck, Heart, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../brand/BrandLogo';

export const Footer: React.FC = () => {
  const { mood, setMood } = useTheme();

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] text-[var(--ink)] mt-24">
      {/* Editorial Promise Banner */}
      <div className="border-b border-[var(--border)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] shadow-stamp">
              <Clock className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-[var(--ink)]">15-Min Pickup Slots</h4>
              <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed font-body">
                Choose your exact collection window. We brew your chai fresh so it never sits cold.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] shadow-stamp">
              <IndianRupee className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-[var(--ink)]">Cash or UPI at Counter</h4>
              <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed font-body">
                Zero online payment friction. Order ahead, check in with your ticket number, pay upon warm pickup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] shadow-stamp">
              <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-[var(--ink)]">Honest Queue Truth</h4>
              <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed font-body">
                No fake progress bars. Our live order tracker calculates dynamic wait times from real kitchen tickets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <BrandLogo variant="default" />
          <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-body">
            Contemporary Indian chai culture meets third-wave artisanal craft. Fresh whole spices, rolling brass kettles, and unglazed terracotta kulhads.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)] pt-1">
            <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0" />
            <span>Counter 01 · Artisanal Market Lane</span>
          </div>
        </div>

        <div>
          <h5 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--ink)] mb-4">
            The Atmospheres
          </h5>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => setMood('adda')}
                className={`hover:text-[var(--primary)] transition-colors cursor-pointer text-left ${
                  mood === 'adda' ? 'font-bold text-[var(--primary)]' : 'text-[var(--ink-muted)]'
                }`}
              >
                Classic Adda (सवेरा · Morning Chai & Buns)
              </button>
            </li>
            <li>
              <button
                onClick={() => setMood('classics')}
                className={`hover:text-[var(--primary)] transition-colors cursor-pointer text-left ${
                  mood === 'classics' ? 'font-bold text-[var(--primary)]' : 'text-[var(--ink-muted)]'
                }`}
              >
                Café Classics (दोपहर · Kaapi & Toasties)
              </button>
            </li>
            <li>
              <button
                onClick={() => setMood('lab')}
                className={`hover:text-[var(--primary)] transition-colors cursor-pointer text-left ${
                  mood === 'lab' ? 'font-bold text-[var(--primary)]' : 'text-[var(--ink-muted)]'
                }`}
              >
                Trend Lab (शाम · Cold Brew & Matcha)
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--ink)] mb-4">
            Navigation
          </h5>
          <ul className="space-y-2.5 text-xs text-[var(--ink-muted)]">
            <li>
              <Link to="/menu" className="hover:text-[var(--primary)] transition-colors">
                Full 19-Recipe Catalogue
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-[var(--primary)] transition-colors">
                15-Min Pickup Booking
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-[var(--primary)] transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Staff Fulfillment KDS</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-bold text-xs uppercase tracking-widest text-[var(--ink)] mb-4">
            Service Hours
          </h5>
          <div className="text-xs text-[var(--ink-muted)] space-y-2 leading-relaxed">
            <p className="flex justify-between">
              <span>Monday – Sunday:</span>
              <span className="font-bold text-[var(--ink)]">07:00 – 23:00 IST</span>
            </p>
            <p className="flex justify-between">
              <span>Counter Capacity:</span>
              <span className="font-bold text-[var(--ink)]">6 Orders / 15 Min</span>
            </p>
            <p className="pt-2 text-[11px] text-[var(--ink-muted)] border-t border-[var(--border-subtle)]">
              Fresh batches boiled continuously. Pickup slots open 15 minutes ahead.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[var(--border)] py-4 px-4 sm:px-6 lg:px-8 text-center text-[11px] text-[var(--ink-muted)] flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <p>© 2026 Chaiwala Café Sanctuary. All recipes handcrafted fresh to order.</p>
        <p className="flex items-center gap-1 mt-1 sm:mt-0">
          <span>Brewed with devotion & spices</span>
          <Heart className="w-3 h-3 text-[var(--primary)] fill-current inline" />
        </p>
      </div>
    </footer>
  );
};

export default Footer;
