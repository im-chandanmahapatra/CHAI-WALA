import React from 'react';
import { Link } from 'react-router';

interface BrandLogoProps {
  variant?: 'default' | 'compact' | 'stacked';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'default', className = '' }) => {
  if (variant === 'compact') {
    return (
      <Link to="/" className={`inline-flex items-center gap-2 group ${className}`}>
        {/* Kettle Insignia */}
        <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-stamp group-hover:scale-105 transition-transform">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M19 8h-1V6c0-1.1-.9-2-2-2H8C6.9 4 6 4.9 6 6v2H5c-1.1 0-2 .9-2 2v2c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4v-2c0-1.1-.9-2-2-2zm-3 8H8c-1.1 0-2-.9-2-2v-1h12v1c0 1.1-.9 2-2 2zM8 6h8v2H8V6zm14 5h-2v-1h2v1zM4 11H2v-1h2v1zM10 2h4v1h-4V2z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-base tracking-tight text-[var(--ink)] leading-none">
            CHAIWALA
          </span>
          <span className="font-devanagari text-[10px] text-[var(--primary)] font-semibold tracking-wide leading-none mt-0.5">
            चायवाला
          </span>
        </div>
      </Link>
    );
  }

  if (variant === 'stacked') {
    return (
      <Link to="/" className={`inline-flex flex-col items-center text-center group ${className}`}>
        <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-card mb-3 group-hover:scale-105 transition-transform">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M19 8h-1V6c0-1.1-.9-2-2-2H8C6.9 4 6 4.9 6 6v2H5c-1.1 0-2 .9-2 2v2c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4v-2c0-1.1-.9-2-2-2zm-3 8H8c-1.1 0-2-.9-2-2v-1h12v1c0 1.1-.9 2-2 2zM8 6h8v2H8V6zm14 5h-2v-1h2v1zM4 11H2v-1h2v1zM10 2h4v1h-4V2z" />
          </svg>
        </div>
        <span className="font-display font-black text-2xl tracking-tight text-[var(--ink)]">
          CHAIWALA
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="h-px w-6 bg-[var(--border)]" />
          <span className="font-devanagari text-xs text-[var(--primary)] font-bold tracking-wider">
            चायवाला
          </span>
          <span className="h-px w-6 bg-[var(--border)]" />
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--ink-muted)] mt-1.5">
          Artisanal Sanctuary · Estd. 2026
        </span>
      </Link>
    );
  }

  // Default Horizontal Navbar Variant
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* Handcrafted Kettle Emblem */}
      <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-stamp group-hover:scale-105 transition-transform relative overflow-hidden flex-shrink-0">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 8h-1V6c0-1.1-.9-2-2-2H8C6.9 4 6 4.9 6 6v2H5c-1.1 0-2 .9-2 2v2c0 2.21 1.79 4 4 4h10c2.21 0 4-1.79 4-4v-2c0-1.1-.9-2-2-2zm-3 8H8c-1.1 0-2-.9-2-2v-1h12v1c0 1.1-.9 2-2 2zM8 6h8v2H8V6zm14 5h-2v-1h2v1zM4 11H2v-1h2v1zM10 2h4v1h-4V2z" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="font-display font-black text-xl tracking-tight text-[var(--ink)] leading-none">
            CHAIWALA
          </span>
          <span className="font-devanagari text-xs text-[var(--primary)] font-bold leading-none tracking-wide">
            चायवाला
          </span>
        </div>
        <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--ink-muted)] mt-1 leading-none">
          Artisanal Café & Sanctuary
        </span>
      </div>
    </Link>
  );
};

export default BrandLogo;
