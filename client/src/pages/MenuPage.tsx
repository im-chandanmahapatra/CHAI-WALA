import React, { useState, useMemo } from 'react';
import { Search, Sparkles, X, Coffee, Flame } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../lib/seed-data';
import { ProductChit } from '../components/menu/ProductChit';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { MoodSlug } from '../lib/database.types';

export const MenuPage: React.FC = () => {
  const { mood, setMood, moodName } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [curatedFlightOnly, setCuratedFlightOnly] = useState<boolean>(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return SEED_PRODUCTS.filter((prod) => {
      if (prod.isArchived) return false;

      // If user toggled to view only active mood's curated flight
      if (curatedFlightOnly) {
        const isMapped = prod.themes.some((t) => t.themeSlug === mood);
        if (!isMapped) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && prod.categorySlug !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        const matchesCat = prod.categorySlug.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by mood priority if mood filter active, otherwise by category
      const aOrder = a.themes.find((t) => t.themeSlug === mood)?.sortOrder || 99;
      const bOrder = b.themes.find((t) => t.themeSlug === mood)?.sortOrder || 99;
      return aOrder - bOrder;
    });
  }, [mood, selectedCategory, searchQuery, curatedFlightOnly]);

  const moods: { slug: MoodSlug; label: string; icon: React.ReactNode }[] = [
    { slug: 'adda', label: 'Classic Adda', icon: <Flame className="w-3.5 h-3.5 text-[#9E3D24]" /> },
    { slug: 'classics', label: 'Café Classics', icon: <Coffee className="w-3.5 h-3.5 text-[#683C54]" /> },
    { slug: 'lab', label: 'Trend Lab', icon: <Sparkles className="w-3.5 h-3.5 text-[#445932]" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Navbar />

      <main className="flex-1 pb-28">
        {/* Editorial Page Header */}
        <div className="bg-[var(--surface)] border-b border-[var(--border)] py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--primary)]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handcrafted Beverage & Bakehouse Menu</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-[var(--ink)]">
                Crafted for Every Moment
              </h1>
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] max-w-xl leading-relaxed font-body">
                19 authentic recipes simmered slow in brass kettles, dripped through brass filters, or whisked fresh. All items prepared to order for warm pickup.
              </p>
            </div>

            {/* Real-time Search Box */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-[var(--ink-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ginger, filter kaapi, toasties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-full text-xs text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-stamp"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar: Flight Toggle & Categories */}
        <div className="sticky top-[65px] z-30 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border)] py-3 px-4 sm:px-6 lg:px-8 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[var(--ink)] text-white shadow-stamp'
                    : 'bg-[var(--surface-subtle)] text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)]'
                }`}
              >
                All Categories ({SEED_PRODUCTS.length})
              </button>

              {SEED_CATEGORIES.map((cat) => {
                const count = SEED_PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
                const active = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 ${
                      active
                        ? 'bg-[var(--primary)] text-white shadow-stamp'
                        : 'bg-[var(--surface-subtle)] text-[var(--ink-muted)] hover:text-[var(--ink)] border border-[var(--border)]'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Curated Mood Flight Toggle */}
            <div className="flex items-center gap-2 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--border-subtle)]">
              <span className="text-[11px] font-bold text-[var(--ink-muted)] hidden md:inline">
                Atmosphere Flight:
              </span>
              <button
                onClick={() => setCuratedFlightOnly(!curatedFlightOnly)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  curatedFlightOnly
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-stamp'
                    : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--border)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                <span>{curatedFlightOnly ? `Flight: ${moodName}` : 'All Atmospheres'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-muted)] flex items-center justify-center mx-auto shadow-stamp">
                <Coffee className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--ink)]">
                No matching recipes found
              </h3>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-body">
                We couldn't find anything matching "{searchQuery}". Try selecting "All Categories" or toggling off the curated flight filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setCuratedFlightOnly(false);
                }}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-full text-xs font-bold shadow-stamp hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-[var(--ink-muted)]">
                  Showing {filteredProducts.length} handcrafted {filteredProducts.length === 1 ? 'item' : 'items'}
                </span>
                {curatedFlightOnly && (
                  <span className="text-xs font-bold text-[var(--primary)]">
                    Filtered by {moodName} flight
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductChit key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MenuPage;
