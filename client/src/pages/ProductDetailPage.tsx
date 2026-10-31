import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Clock, Plus, Minus, Check, ShoppingBag, Sparkles, Flame, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { SEED_PRODUCTS } from '../lib/seed-data';
import { Option } from '../lib/database.types';
import { ProductImage } from '../components/menu/ProductImage';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { mood } = useTheme();
  const { addItem, setIsCartOpen } = useCart();

  const product = SEED_PRODUCTS.find((p) => p.slug === slug);

  const [selectedOptions, setSelectedOptions] = useState<Option[]>(() => {
    if (!product || !product.optionGroups) return [];
    const defaults: Option[] = [];
    product.optionGroups.forEach((grp) => {
      grp.options.forEach((opt) => {
        if (opt.isDefault && opt.isAvailable) defaults.push(opt);
      });
    });
    return defaults;
  });

  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  if (!product || product.isArchived) {
    return (
      <div className="min-h-screen bg-[var(--linen)] py-24 px-4 text-center max-w-md mx-auto space-y-5">
        <h2 className="font-serif font-bold text-2xl text-[var(--dark-roast)]">Recipe Not Found</h2>
        <p className="text-xs text-[var(--clay)] leading-relaxed">
          The recipe "{slug}" is currently not in our counter menu or has been archived.
        </p>
        <Link
          to="/menu"
          className="inline-block px-6 py-3 bg-[var(--terracotta)] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#85321D] transition-colors shadow-[var(--shadow-warm-sm)]"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const themeMapping = product.themes.find((t) => t.themeSlug === mood);
  const blurb = themeMapping?.copyOverride || product.description;

  const isOptionSelected = (optId: string) => selectedOptions.some((o) => o.id === optId);

  const handleToggleOption = (groupName: string, opt: Option, minSelect: number, maxSelect: number) => {
    const group = product.optionGroups?.find((g) => g.name === groupName);
    if (!group) return;

    if (maxSelect === 1) {
      setSelectedOptions((prev) => {
        const withoutGroup = prev.filter((o) => !group.options.some((go) => go.id === o.id));
        return [...withoutGroup, opt];
      });
    } else {
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

  const optionDeltas = selectedOptions.reduce((acc, o) => acc + o.priceDeltaPaise, 0);
  const unitPricePaise = product.basePricePaise + optionDeltas;
  const lineTotalPaise = unitPricePaise * quantity;

  const handleAddToCart = () => {
    if (!isCustomizationValid()) return;
    addItem(product, selectedOptions, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--linen)] py-10 px-4 sm:px-6 pb-32">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--clay)] hover:text-[var(--terracotta)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu Catalogue</span>
        </Link>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product Photography & Badges */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl overflow-hidden shadow-[var(--shadow-warm-md)] relative aspect-[4/5] flex items-center justify-center">
              <ProductImage
                src={product.imagePath}
                alt={product.imageAlt}
                name={product.name}
                categoryName={product.categorySlug}
                loading="eager"
              />

              {/* Dietary Green Badge */}
              <div className="absolute top-4 left-4 bg-[var(--parchment)]/95 backdrop-blur-xs border border-[var(--warm-border)] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full border border-[#2E7D32] flex items-center justify-center p-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dark-roast)]">
                  Pure Vegetarian
                </span>
              </div>

              {/* Mood Tag Badge */}
              <div className="absolute top-4 right-4 flex gap-1.5">
                {product.themes.map((th) => (
                  <span
                    key={th.themeSlug}
                    className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--dark-roast)]/80 text-[var(--parchment)] backdrop-blur-xs"
                  >
                    {th.themeSlug}
                  </span>
                ))}
              </div>
            </div>

            {/* Brewing Details Card */}
            <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-xl p-4 flex items-center justify-between text-xs text-[var(--clay)] shadow-[var(--shadow-warm-sm)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--terracotta)]" />
                <span>Prep: <strong className="text-[var(--dark-roast)]">{product.prepMinutes} mins</strong></span>
              </div>
              <div className="h-4 w-px bg-[var(--warm-border)]" />
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[var(--brass)]" />
                <span>Brewed to order</span>
              </div>
              <div className="h-4 w-px bg-[var(--warm-border)]" />
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Single-origin estate</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Chit & Order Control */}
          <div className="lg:col-span-6 bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-warm-md)] space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--brass)] block mb-1">
                {product.categorySlug.toUpperCase()} · ESTATE HARVEST
              </span>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[var(--dark-roast)] leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--clay)] mt-3 leading-relaxed">
                {blurb}
              </p>
            </div>

            {/* Option Groups */}
            {product.optionGroups && product.optionGroups.length > 0 && (
              <div className="space-y-6 pt-4 border-t border-[var(--warm-border)]">
                {product.optionGroups.map((group) => (
                  <div key={group.id} className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="font-serif font-semibold text-xs uppercase tracking-wider text-[var(--dark-roast)]">
                        {group.name}
                      </label>
                      <span className="text-[10px] text-[var(--clay)] font-medium">
                        {group.minSelect > 0 ? 'Selection Required' : 'Optional Choice'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.options.map((opt) => {
                        const selected = isOptionSelected(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleToggleOption(group.name, opt, group.minSelect, group.maxSelect)
                            }
                            className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                              selected
                                ? 'bg-[var(--terracotta)] text-white border-[var(--terracotta)] shadow-[var(--shadow-warm-sm)] font-semibold'
                                : 'bg-[var(--linen)] text-[var(--dark-roast)] border-[var(--warm-border)] hover:border-[var(--terracotta)]/40'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  selected
                                    ? 'bg-white text-[var(--terracotta)] border-white'
                                    : 'border-[var(--clay)] bg-[var(--parchment)]'
                                }`}
                              >
                                {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className="truncate">{opt.name}</span>
                            </div>
                            {opt.priceDeltaPaise > 0 && (
                              <span
                                className={`text-[11px] font-sans ml-2 shrink-0 ${
                                  selected ? 'text-white/90' : 'text-[var(--brass)] font-semibold'
                                }`}
                              >
                                +₹{(opt.priceDeltaPaise / 100).toFixed(0)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper & Add to Order Bar */}
            <div className="pt-6 border-t border-[var(--warm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="font-serif font-semibold text-xs uppercase tracking-wider text-[var(--dark-roast)]">
                  Cups / Portions
                </span>
                <div className="flex items-center gap-2 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg border border-[var(--warm-border)] flex items-center justify-center text-[var(--dark-roast)] hover:bg-[var(--parchment)] disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-serif font-bold text-sm w-8 text-center text-[var(--dark-roast)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    disabled={quantity >= 20}
                    className="w-8 h-8 rounded-lg border border-[var(--warm-border)] flex items-center justify-center text-[var(--dark-roast)] hover:bg-[var(--parchment)] disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-[var(--clay)] block uppercase font-bold tracking-wider">
                    Total
                  </span>
                  <span className="font-serif font-bold text-2xl text-[var(--dark-roast)]">
                    ₹{(lineTotalPaise / 100).toFixed(0)}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!isCustomizationValid() || !product.isAvailable}
                  className="py-3.5 px-6 bg-[var(--terracotta)] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#85321D] transition-all disabled:opacity-40 cursor-pointer flex items-center gap-2 shadow-[var(--shadow-warm-sm)]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Order</span>
                </button>
              </div>
            </div>

            {/* Added Toast */}
            {addedToast && (
              <div className="p-3 bg-[#EDF7ED] border border-[#2E7D32]/30 rounded-xl text-[#1B5E20] text-xs flex items-center justify-center gap-2 animate-fade-in font-medium">
                <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                <span>Added to your order bag!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
