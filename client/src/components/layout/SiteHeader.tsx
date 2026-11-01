import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, X } from 'lucide-react';

interface SiteHeaderProps {
  eraMode: '1900s' | '2020s';
  itemCount: number;
  onOpenCart: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export const BrandMark: React.FC = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 14v11c0 9 5.2 14 13 14s13-5 13-14V14" />
    <path d="M37 18h2.5a4.5 4.5 0 0 1 0 9H36" />
    <path d="M19 4c-2 2.1-2 4.2 0 6.3M25 4c-2 2.1-2 4.2 0 6.3M31 4c-2 2.1-2 4.2 0 6.3" />
  </svg>
);

export const SiteHeader: React.FC<SiteHeaderProps> = ({ itemCount, onOpenCart, search, onSearchChange }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The header sits transparent on the hero photograph and turns solid once the page moves.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#top" className="site-brand" aria-label="Chaiwala home">
        <span className="brand-monogram">
          <BrandMark />
        </span>
        <span className="brand-typography">
          <span className="brand-title">Chaiwala</span>
          <span className="brand-subtitle">Chai across generations</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#menu" className="site-nav-link">Menu</a>
        <a href="#story" className="site-nav-link">Philosophy</a>
        <a href="#radio" className="site-nav-link">Radio</a>
        <a href="#ritual" className="site-nav-link">How it works</a>
      </nav>

      <div className="site-header-actions">
        {searchOpen ? (
          <div className="header-search-bar">
            <Search size={15} className="search-icon" aria-hidden="true" />
            <input
              autoFocus
              type="search"
              aria-label="Search drinks"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search the menu"
              onBlur={() => !search && setSearchOpen(false)}
            />
            <button
              type="button"
              className="clear-search-btn"
              aria-label="Close search"
              onClick={() => {
                onSearchChange('');
                setSearchOpen(false);
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="action-icon-btn"
            aria-label="Search the menu"
            onClick={() => {
              setSearchOpen(true);
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Search size={17} />
          </button>
        )}

        <button
          type="button"
          className="action-bag-pill"
          aria-label={`Open bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          onClick={onOpenCart}
        >
          <ShoppingBag size={16} />
          <span className="bag-label">Bag</span>
          <span className={`bag-count ${itemCount ? 'has-items' : ''}`}>{itemCount}</span>
        </button>
      </div>
    </header>
  );
};
