import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Option } from '../../lib/database.types';
import { useCart } from '../../context/CartContext';
import { ProductImage } from './ProductImage';

interface OptionCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, options: Option[], quantity: number) => void;
}

export const OptionCustomizerModal: React.FC<OptionCustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const { addItem } = useCart();
  if (!product) return null;

  // Initialize selected options with defaults
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
    const defaults: Option[] = [];
    product.optionGroups?.forEach((group) => {
      group.options.forEach((opt) => {
        if (opt.isDefault && opt.isAvailable) {
          defaults.push(opt);
        }
      });
    });
    return defaults;
  });

  const [quantity, setQuantity] = useState(1);

  // Check if option is selected
  const isOptionSelected = (optId: string) => selectedOptions.some((o) => o.id === optId);

  // Toggle option
  const handleToggleOption = (groupName: string, opt: Option, minSelect: number, maxSelect: number) => {
    const group = product.optionGroups?.find((g) => g.name === groupName);
    if (!group) return;

    if (maxSelect === 1) {
      // Radio behavior
      setSelectedOptions((prev) => {
        const withoutGroup = prev.filter((o) => !group.options.some((go) => go.id === o.id));
        return [...withoutGroup, opt];
      });
    } else {
      // Multi-select behavior
      setSelectedOptions((prev) => {
        const already = prev.some((o) => o.id === opt.id);
        if (already) {
          const groupSelected = prev.filter((o) => group.options.some((go) => go.id === o.id));
          if (groupSelected.length <= minSelect) return prev;
          return prev.filter((o) => o.id !== opt.id);
        } else {
          const groupSelected = prev.filter((o) => group.options.some((go) => go.id === o.id));
          if (groupSelected.length >= maxSelect) return prev;
          return [...prev, opt];
        }
      });
    }
  };

  const isCustomizationValid = () => {
    if (!product.optionGroups || product.optionGroups.length === 0) return true;
    for (const group of product.optionGroups) {
      const selectedInGroup = selectedOptions.filter((o) =>
        group.options.some((go) => go.id === o.id)
      );
      if (selectedInGroup.length < group.minSelect || selectedInGroup.length > group.maxSelect) {
        return false;
      }
    }
    return true;
  };

  // Calculate dynamic pricing
  const optionDeltas = selectedOptions.reduce((acc, o) => acc + o.priceDeltaPaise, 0);
  const unitPricePaise = product.basePricePaise + optionDeltas;
  const lineTotalPaise = unitPricePaise * quantity;

  const handleConfirm = () => {
    if (!isCustomizationValid()) return;
    if (onAddToCart) {
      onAddToCart(product, selectedOptions, quantity);
    } else {
      addItem(product, selectedOptions, quantity);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Chit Container */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] shadow-card rounded-3xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-[var(--surface-subtle)]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)] block">
                  Artisanal Customization
                </span>
                <h3 className="font-display font-black text-xl text-[var(--ink)]">{product.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer shadow-stamp"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Product Info Row */}
              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded-xl border border-[var(--border)] overflow-hidden shrink-0 shadow-stamp">
                  <ProductImage
                    src={product.imagePath}
                    alt={product.imageAlt}
                    name={product.name}
                    categoryName={product.categorySlug}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-body">
                    {product.description}
                  </p>
                  <div className="text-xs font-bold text-[var(--ink)] font-tabular pt-1">
                    Base: ₹{(product.basePricePaise / 100).toFixed(0)} · Prep: {product.prepMinutes} mins
                  </div>
                </div>
              </div>

              {/* Option Groups */}
              {product.optionGroups?.map((group) => {
                const isSingle = group.maxSelect === 1;
                return (
                  <div key={group.id} className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                      <span className="font-display font-bold text-sm text-[var(--ink)]">
                        {group.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--ink-muted)]">
                        {group.minSelect > 0 ? 'Required (Select 1)' : 'Optional'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {group.options.map((opt) => {
                        const selected = isOptionSelected(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={!opt.isAvailable}
                            onClick={() =>
                              handleToggleOption(group.name, opt, group.minSelect, group.maxSelect)
                            }
                            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              !opt.isAvailable
                                ? 'opacity-40 cursor-not-allowed bg-[var(--surface-subtle)] border-transparent'
                                : selected
                                ? 'bg-[var(--mood-bg-subtle)] border-[var(--primary)] shadow-stamp'
                                : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-subtle)]'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="font-display font-bold text-xs text-[var(--ink)] block">
                                {opt.name}
                              </span>
                              {opt.priceDeltaPaise > 0 ? (
                                <span className="text-[11px] font-bold text-[var(--primary)] font-tabular">
                                  +₹{(opt.priceDeltaPaise / 100).toFixed(0)}
                                </span>
                              ) : (
                                <span className="text-[10px] text-[var(--ink-muted)]">Included</span>
                              )}
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                selected
                                  ? 'bg-[var(--primary)] border-[var(--primary)] text-white'
                                  : 'border-[var(--border)] bg-[var(--surface)]'
                              }`}
                            >
                              {selected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-5 border-t border-[var(--border)] bg-[var(--surface-subtle)] flex items-center justify-between gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-full px-2 py-1 shadow-stamp">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--surface-subtle)] text-[var(--ink)] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-display font-bold text-sm w-6 text-center text-[var(--ink)] font-tabular">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--surface-subtle)] text-[var(--ink)] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Order Button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleConfirm}
                disabled={!isCustomizationValid()}
                className="flex-1 py-3 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-card shadow-card-hover transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Add to Order</span>
                <span className="font-tabular font-bold text-sm">
                  ₹{(lineTotalPaise / 100).toFixed(0)}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OptionCustomizerModal;
