import React from 'react';
import { useNavigate } from 'react-router';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../menu/ProductImage';

export const CartDrawer: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotalPaise, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const gstPaise = Math.round(subtotalPaise * 0.05);
  const packagingPaise = items.length > 0 ? 1000 : 0;
  const totalPaise = subtotalPaise + gstPaise + packagingPaise;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="w-screen max-w-md bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-[var(--border)] bg-[var(--surface-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs shadow-stamp">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-[var(--ink)]">Your Order Bag</h3>
                    <span className="text-[11px] text-[var(--ink-muted)]">Counter #01 Pickup</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--ink)] flex items-center justify-center hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer shadow-stamp"
                  aria-label="Close cart"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--ink-muted)] shadow-stamp">
                      <ShoppingBag className="w-8 h-8 text-[var(--primary)]" />
                    </div>
                    <h4 className="font-display font-bold text-base text-[var(--ink)]">Your tray is empty</h4>
                    <p className="text-xs text-[var(--ink-muted)] max-w-xs leading-relaxed font-body">
                      Select handcrafted chais, slow-dripped filter coffees, or toasted bakery buns.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-2 px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-stamp cursor-pointer transition-colors"
                    >
                      Browse Full Menu
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 flex gap-3.5 shadow-stamp relative"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-20 rounded-xl border border-[var(--border)] overflow-hidden shrink-0 bg-[var(--surface-subtle)]">
                        <ProductImage
                          src={item.imagePath}
                          alt={item.productName}
                          name={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-display font-bold text-sm text-[var(--ink)] leading-snug">
                              {item.productName}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[var(--ink-muted)] hover:text-red-600 p-1 transition-colors cursor-pointer"
                              aria-label={`Remove ${item.productName}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Options Breakdown */}
                          {item.options.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.options.map((opt, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-[var(--surface-subtle)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-full text-[var(--ink-muted)] font-medium"
                                >
                                  {opt.optionName}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] mt-2">
                          <div className="flex items-center gap-2 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-full px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-[var(--ink)] hover:text-[var(--primary)] p-0.5 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-[var(--ink)] font-tabular w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 20}
                              className="text-[var(--ink)] hover:text-[var(--primary)] p-0.5 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-display font-bold text-sm text-[var(--ink)] font-tabular">
                            ₹{(item.lineTotalPaise / 100).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Billing Breakdown & Checkout CTA */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[var(--border)] bg-[var(--surface-subtle)] space-y-3">
                  <div className="space-y-1.5 text-xs text-[var(--ink-muted)]">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-tabular text-[var(--ink)]">₹{(subtotalPaise / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>F&B GST (5%)</span>
                      <span className="font-tabular text-[var(--ink)]">₹{(gstPaise / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biodegradable Kulhad & Packaging</span>
                      <span className="font-tabular text-[var(--ink)]">₹{(packagingPaise / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)] text-sm font-bold text-[var(--ink)]">
                      <span>Total (Pay Cash/UPI at Pickup)</span>
                      <span className="font-display font-black text-base text-[var(--primary)] font-tabular">
                        ₹{(totalPaise / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-card shadow-card-hover transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Proceed to 15-Min Slot Selection</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-center text-[var(--ink-muted)] mt-2 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zero upfront payment · Reserve warm counter slot</span>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
