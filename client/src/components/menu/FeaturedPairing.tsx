import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../../lib/database.types';

interface FeaturedPairingProps {
  products: Product[];
  totalPricePaise: number;
  onAddPairing: () => void;
}

// Whole rupees print as ₹45; paise always show two digits (₹7.50, never ₹7.5).
const money = (paise: number) => {
  const digits = paise % 100 ? 2 : 0;
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

export const FeaturedPairing: React.FC<FeaturedPairingProps> = ({ products, totalPricePaise, onAddPairing }) => {
  if (products.length < 2) return null;

  return (
    <div className="featured-pairing-banner" role="region" aria-label="House pairing" data-reveal>
      <div className="pairing-visual" aria-hidden="true">
        {products.slice(0, 2).map((p) => (
          <img key={p.id} src={p.imagePath} alt="" loading="lazy" />
        ))}
      </div>

      <div className="pairing-details-col">
        <span className="pairing-badge-tag">The house pairing</span>
        <h3 className="pairing-names-headline">
          {products[0].name} <em>&amp;</em> {products[1].name}
        </h3>
        <p className="pairing-explainer">
          {products.map((p) => `${p.name} ${money(p.basePricePaise)}`).join('  ·  ')}
        </p>
        <p className="pairing-explainer subtle">
          Added with regular size and sugar. Tap any item below to make it your way.
        </p>
        <button type="button" className="pairing-add-both-btn" onClick={onAddPairing}>
          <span>Add both · {money(totalPricePaise)}</span>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
