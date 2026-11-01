import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../../lib/database.types';

interface ProductCardProps {
  product: Product;
  index: number;
  onOpenCustomizer: (product: Product) => void;
}

// Whole rupees print as ₹45; paise always show two digits (₹7.50, never ₹7.5).
const money = (paise: number) => {
  const digits = paise % 100 ? 2 : 0;
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, index, onOpenCustomizer }) => (
  <article className={`era-product-card ${product.isAvailable ? '' : 'is-sold-out'}`} data-reveal>
    <button
      type="button"
      className="card-photo-box"
      tabIndex={-1}
      aria-hidden="true"
      disabled={!product.isAvailable}
      onClick={() => onOpenCustomizer(product)}
    >
      <img src={product.imagePath} alt="" loading="lazy" />
      <span className="card-index">{String(index + 1).padStart(2, '0')}</span>
      {!product.isAvailable && <span className="card-sold-out">Sold out</span>}
    </button>

    <div className="card-details-box">
      <div className="card-title-price-line">
        <h3 className="card-drink-title">{product.name}</h3>
        <span className="card-drink-price">{money(product.basePricePaise)}</span>
      </div>
      <p className="card-drink-desc">{product.description}</p>
      <button
        type="button"
        className="card-plus-btn"
        aria-label={product.isAvailable ? `Customize and add ${product.name}` : `${product.name} is sold out`}
        disabled={!product.isAvailable}
        onClick={() => onOpenCustomizer(product)}
      >
        <span>{product.isAvailable ? 'Add to bag' : 'Sold out'}</span>
        {product.isAvailable && <Plus size={15} />}
      </button>
    </div>
  </article>
);
