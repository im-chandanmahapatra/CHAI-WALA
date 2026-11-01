import React from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../../lib/database.types';
import { ProductCard } from './ProductCard';
import { FeaturedPairing } from './FeaturedPairing';

interface EraMenuSectionProps {
  eraMode: '1900s' | '2020s';
  displayedProducts: Product[];
  pairingProducts: Product[];
  pairingTotalPrice: number;
  onAddPairing: () => void;
  onOpenCustomizer: (product: Product) => void;
  search: string;
  onSearchChange: (val: string) => void;
  showFullMenu: boolean;
  onToggleFullMenu: () => void;
  totalCatalogueCount: number;
  catalogueError: string;
}

export const EraMenuSection: React.FC<EraMenuSectionProps> = ({
  eraMode,
  displayedProducts,
  pairingProducts,
  pairingTotalPrice,
  onAddPairing,
  onOpenCustomizer,
  search,
  onSearchChange,
  showFullMenu,
  onToggleFullMenu,
  totalCatalogueCount,
  catalogueError,
}) => (
  <section id="menu" className="era-menu-section" aria-labelledby="menu-section-heading">
    <header className="section-head" data-reveal>
      <p className="section-number">
        <span>No. 01</span> The menu
      </p>
      <div className="section-head-grid">
        <h2 id="menu-section-heading" className="menu-display-heading">
          {eraMode === '1900s' ? (
            <>
              Poured the <em>old way.</em>
            </>
          ) : (
            <>
              Brewed for <em>right now.</em>
            </>
          )}
        </h2>
        <p className="menu-supporting-desc">
          {eraMode === '1900s'
            ? 'Time-honoured recipes slow-simmered with freshly ground spice, ginger and robust Assam CTC — the way the street corner always made it.'
            : 'Specialty drinks and mindful brews for modern pauses — from ceremonial matcha to brown-sugar boba, made fresh to order.'}
        </p>
      </div>
    </header>

    <FeaturedPairing products={pairingProducts} totalPricePaise={pairingTotalPrice} onAddPairing={onAddPairing} />

    <div className="menu-action-toolbar">
      <div className="menu-search-capsule">
        <Search size={16} className="capsule-icon" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search the menu"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search chai, coffee, matcha…"
        />
        {search && (
          <button type="button" className="clear-capsule-btn" aria-label="Clear search" onClick={() => onSearchChange('')}>
            <X size={14} />
          </button>
        )}
      </div>

      <div className="menu-view-tabs" role="group" aria-label="Menu view">
        <button type="button" aria-pressed={!showFullMenu} onClick={() => showFullMenu && onToggleFullMenu()}>
          {eraMode === '1900s' ? '1900s favourites' : '2020s favourites'}
        </button>
        <button type="button" aria-pressed={showFullMenu} onClick={() => !showFullMenu && onToggleFullMenu()}>
          Full menu <span className="tab-count">{totalCatalogueCount}</span>
        </button>
      </div>
    </div>

    {catalogueError && (
      <p role="alert" className="catalogue-alert-error">
        {catalogueError}
      </p>
    )}

    {search.trim() && !displayedProducts.length && (
      <p role="status" className="menu-empty-state">
        Nothing on the menu matches “{search.trim()}”.
        <button type="button" onClick={() => onSearchChange('')}>
          Clear search
        </button>
      </p>
    )}

    <div className="four-column-product-grid">
      {displayedProducts.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} onOpenCustomizer={onOpenCustomizer} />
      ))}
    </div>
  </section>
);
