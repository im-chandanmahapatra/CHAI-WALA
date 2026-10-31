import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Clock, Ban } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../lib/database.types';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { ProductImage } from './ProductImage';
import { OptionCustomizerModal } from './OptionCustomizerModal';

interface ProductChitProps {
  product: Product;
}

export const ProductChit: React.FC<ProductChitProps> = ({ product }) => {
  const navigate = useNavigate();
  const { mood } = useTheme();
  const { addItem } = useCart();
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Find theme-specific copy override if defined
  const themeMapping = product.themes.find((t) => t.themeSlug === mood);
  const blurb = themeMapping?.copyOverride || product.description;

  const hasOptions = Boolean(product.optionGroups && product.optionGroups.length > 0);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;

    if (hasOptions) {
      setIsCustomizing(true);
    } else {
      addItem(product, [], 1);
    }
  };

  const handleCardClick = () => {
    navigate(`/menu/${product.slug}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col justify-between shadow-card shadow-card-hover transition-all duration-300 ${
          !product.isAvailable ? 'opacity-70 grayscale-30' : 'cursor-pointer'
        }`}
      >
        {/* Top Product Image (4:5 Fixed Aspect Ratio) */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-subtle)]">
          <ProductImage
            src={product.imagePath}
            alt={product.imageAlt}
            name={product.name}
            categoryName={product.categorySlug}
          />

          {/* Top Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Pure Veg Green Dot Badge */}
            <div
              className="w-4 h-4 rounded-sm border border-emerald-600 bg-white/95 p-0.5 flex items-center justify-center shadow-stamp"
              title="100% Pure Vegetarian"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>

            {/* Prep Minutes Badge */}
            <div className="bg-white/95 backdrop-blur-md border border-[var(--border)] text-[var(--ink)] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-stamp">
              <Clock className="w-3 h-3 text-[var(--primary)]" />
              <span className="font-tabular">{product.prepMinutes}m</span>
            </div>
          </div>

          {/* Sold-out Stamp Overlay */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="border border-red-500 bg-white text-red-700 px-3.5 py-1.5 rounded-lg font-display font-black text-xs uppercase tracking-wider shadow-card flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5" />
                <span>86’d / Sold Out</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors leading-snug line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-[var(--ink-muted)] line-clamp-2 leading-relaxed font-body">
              {blurb}
            </p>
          </div>

          {/* Bottom Price & Action Row */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--ink-muted)] block">
                Price
              </span>
              <span className="font-display font-bold text-base text-[var(--ink)] font-tabular">
                ₹{(product.basePricePaise / 100).toFixed(0)}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleActionClick}
              disabled={!product.isAvailable}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-stamp cursor-pointer ${
                !product.isAvailable
                  ? 'bg-[var(--surface-subtle)] text-[var(--ink-muted)] cursor-not-allowed border border-[var(--border)]'
                  : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{hasOptions ? 'Customize' : 'Add'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Option Customizer Modal */}
      {hasOptions && (
        <OptionCustomizerModal
          product={product}
          isOpen={isCustomizing}
          onClose={() => setIsCustomizing(false)}
        />
      )}
    </>
  );
};

export default ProductChit;
