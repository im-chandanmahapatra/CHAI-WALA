import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronRight,
  Clock3,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Option, PickupSlot, Product } from '../lib/database.types';
import { SEED_PRODUCTS } from '../lib/seed-data';
import { isSupabaseConfigured } from '../lib/supabase';
import { loadCatalogue, loadPickupWindows, placeOrder } from '../lib/ordering';
import { AudioPlayerState, radioAudio } from '../lib/radio-audio';

// Modular Clean Presentation Layer
import { SiteHeader } from '../components/layout/SiteHeader';
import { CinematicHero } from '../components/hero/CinematicHero';
import { EraMenuSection } from '../components/menu/EraMenuSection';
import { BrandStory } from '../components/story/BrandStory';
import { EraRadio } from '../components/audio/EraRadio';
import { AddaSessions } from '../components/audio/AddaSessions';
import { OrderRitual } from '../components/order/OrderRitual';
import { SiteFooter } from '../components/layout/SiteFooter';
import { DynamicIslandPlayer } from '../components/audio/DynamicIslandPlayer';
import { TheatreModeOverlay } from '../components/audio/TheatreModeOverlay';

export type EraMode = '1900s' | '2020s';

interface OrderResult {
  displayNumber: string;
  trackingToken: string;
  status: string;
}

// Whole rupees print as ₹45; paise always show two digits (₹7.50, never ₹7.5).
const money = (paise: number) => {
  const digits = paise % 100 ? 2 : 0;
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const defaults = (product: Product) =>
  product.optionGroups?.flatMap((group) => group.options.filter((option) => option.isDefault && option.isAvailable)) ?? [];

// crypto.randomUUID only exists in secure contexts; phones testing over LAN (http://192.168.x.x) lack it.
const newRequestKey = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

const formatSlot = (slot: PickupSlot) =>
  `${new Date(slot.startsAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })} – ${new Date(slot.endsAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;

export const OrderPage: React.FC = () => {
  const { items, addItem, updateQuantity, removeItem, clearCart, subtotalPaise, itemCount } = useCart();

  // Era mode: Single source of truth (1900s Adda vs 2020s Café)
  const [eraMode, setEraMode] = useState<EraMode>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlEra = params.get('era');
      if (urlEra === '2020s' || urlEra === '1900s') return urlEra;
      const saved = localStorage.getItem('cw.era.v3');
      return saved === '2020s' ? '2020s' : '1900s';
    } catch {
      return '1900s';
    }
  });

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioState, setAudioState] = useState<AudioPlayerState>(() => radioAudio.getState());

  // Search & Catalog
  const [search, setSearch] = useState('');
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [catalogue, setCatalogue] = useState<Product[]>(isSupabaseConfigured ? [] : SEED_PRODUCTS);
  const [catalogueError, setCatalogueError] = useState('');
  const [toastNotice, setToastNotice] = useState('');

  // Modals
  const [customProduct, setCustomProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderResult | null>(null);

  // Pickup slots & Checkout state
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [slotId, setSlotId] = useState('');
  const [slotLoading, setSlotLoading] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestKey = useRef('');
  if (!requestKey.current) requestKey.current = newRequestKey();

  // Load Catalogue
  useEffect(() => {
    loadCatalogue()
      .then(setCatalogue)
      .catch(() => setCatalogueError('Failed to load menu catalogue. Please refresh.'));
  }, []);

  // Switch Era Mode
  const switchEra = (mode: EraMode) => {
    setEraMode(mode);
    try {
      localStorage.setItem('cw.era.v3', mode);
      const url = new URL(window.location.href);
      url.searchParams.set('era', mode);
      window.history.replaceState({}, '', url.toString());
    } catch {}

    if (isPlayingAudio) {
      radioAudio.play(mode);
    } else {
      radioAudio.setMode(mode);
    }
  };

  const toggleRadioAudio = () => {
    radioAudio.toggle(eraMode);
  };

  // Sync state with radioAudio engine
  useEffect(() => {
    return radioAudio.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying);
      setAudioState(state);
    });
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastNotice) return;
    const timer = setTimeout(() => setToastNotice(''), 3500);
    return () => clearTimeout(timer);
  }, [toastNotice]);

  // Load Pickup Windows
  // Background refreshes stay silent so the list and submit button don't flicker every 30s.
  const loadSlots = async (silent = false) => {
    if (!silent) {
      setSlotLoading(true);
      setSlotError('');
    }
    try {
      const data = await loadPickupWindows();
      const available = (data ?? []).filter(
        (slot: PickupSlot) => slot.status === 'AVAILABLE' && slot.remaining > 0 && new Date(slot.startsAt).getTime() > Date.now()
      );
      setSlots(available);
      setSlotId((curr) => (available.some((s) => s.id === curr) ? curr : available[0]?.id ?? ''));
      setSlotError('');
    } catch {
      setSlotError('Unable to load pickup slots. Please retry.');
    } finally {
      if (!silent) setSlotLoading(false);
    }
  };

  useEffect(() => {
    if (checkoutOpen) {
      void loadSlots();
      const interval = window.setInterval(() => void loadSlots(true), 30000);
      return () => clearInterval(interval);
    }
  }, [checkoutOpen]);

  // Body scroll lock & Escape key handler
  useEffect(() => {
    if (!(customProduct || cartOpen || checkoutOpen || confirmation)) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        setCustomProduct(null);
        setCartOpen(false);
        setCheckoutOpen(false);
        setConfirmation(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [customProduct, cartOpen, checkoutOpen, confirmation, isSubmitting]);

  // Open customizer
  const openProduct = (prod: Product) => {
    setCustomProduct(prod);
    setSelectedOptions(defaults(prod));
    setQuantity(1);
  };

  // Filter curated products based on active Era
  const curatedIds = useMemo(() => {
    if (eraMode === '1900s') {
      // Eight items fill the 4- and 2-column grids evenly, with no orphaned last card.
      return ['prod-01', 'prod-03', 'prod-02', 'prod-05', 'prod-04', 'prod-06', 'prod-07', 'prod-10'];
    } else {
      return ['prod-08', 'prod-15', 'prod-09', 'prod-16', 'prod-14', 'prod-19', 'prod-18', 'prod-17'];
    }
  }, [eraMode]);

  const query = search.trim().toLowerCase();

  // A search always covers the whole catalogue, so "matcha" still finds it while in the 1900s menu.
  const displayedProducts = useMemo(() => {
    const list =
      showFullMenu || query
        ? catalogue
        : (curatedIds
            .map((id) => catalogue.find((p) => p.slug === SEED_PRODUCTS.find((s) => s.id === id)?.slug))
            .filter(Boolean) as Product[]);

    return list.filter(
      (p) => !p.isArchived && (!query || `${p.name} ${p.description}`.toLowerCase().includes(query))
    );
  }, [catalogue, showFullMenu, curatedIds, query]);

  // Fade sections up as they enter the viewport; content stays visible without JS or with reduced motion.
  useEffect(() => {
    const pending = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pending.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }),
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );
    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [eraMode, displayedProducts]);

  // House pairing per era
  const pairingIds = eraMode === '1900s' ? ['prod-03', 'prod-05'] : ['prod-08', 'prod-19'];
  const pairingProducts = pairingIds
    .map((id) => catalogue.find((p) => p.slug === SEED_PRODUCTS.find((s) => s.id === id)?.slug))
    .filter((p): p is Product => !!p && p.isAvailable);

  const pairingTotalPrice = pairingProducts.reduce(
    (sum, p) => sum + p.basePricePaise + defaults(p).reduce((n, o) => n + o.priceDeltaPaise, 0),
    0
  );

  // Billing math in integer paise
  const gstPaise = Math.round(subtotalPaise * 0.05);
  const packagingPaise = items.length ? 1000 : 0;
  const grandTotalPaise = subtotalPaise + gstPaise + packagingPaise;

  // Checkout submission
  const submitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    if (!items.length) return setSubmitError('Your bag is currently empty.');
    if (!customerName.trim()) return setSubmitError('Please enter the name for your pickup ticket.');
    if (customerPhone.replace(/\D/g, '').length !== 10) return setSubmitError('Please enter a valid 10-digit mobile number.');
    if (!slotId) return setSubmitError('Please choose an available pickup window.');

    setIsSubmitting(true);
    try {
      const res = await placeOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          optionIds: item.options.map((opt) => opt.optionId),
        })),
        pickupSlotId: slotId,
        customer: {
          name: customerName.trim(),
          phone: customerPhone.replace(/\D/g, ''),
          note: customerNote.trim() || undefined,
        },
        idempotencyKey: requestKey.current,
      });

      setConfirmation(res);
      requestKey.current = newRequestKey();
      clearCart();
      setCartOpen(false);
      setCheckoutOpen(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to confirm order with counter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="top" className="chaiwala-app chaiwala-redesign" data-era-mode={eraMode}>
      {/* Header & Navigation */}
      <SiteHeader
        eraMode={eraMode}
        itemCount={itemCount}
        onOpenCart={() => setCartOpen(true)}
        search={search}
        onSearchChange={setSearch}
      />

      <main id="main-content">
        {/* SECTION A: Cinematic Hero (Reference 1) */}
        <CinematicHero
          eraMode={eraMode}
          onSwitchEra={switchEra}
          isPlayingAudio={isPlayingAudio}
          onToggleAudio={toggleRadioAudio}
        />

        {/* Lower Page Wrapper (Reference 2: Light Aged Parchment / Soft Ivory) */}
        <div className="redesign-lower-page">
          {/* SECTION B, C, D: Curated Menu, House Pairing & Product Cards */}
          <EraMenuSection
            eraMode={eraMode}
            displayedProducts={displayedProducts}
            pairingProducts={pairingProducts}
            pairingTotalPrice={pairingTotalPrice}
            onAddPairing={() => {
              pairingProducts.forEach((p) => addItem(p, defaults(p), 1));
              setToastNotice('House pairing added to your bag');
            }}
            onOpenCustomizer={openProduct}
            search={search}
            onSearchChange={setSearch}
            showFullMenu={showFullMenu}
            onToggleFullMenu={() => setShowFullMenu((prev) => !prev)}
            totalCatalogueCount={catalogue.length}
            catalogueError={catalogueError}
          />

          {/* SECTION E: Brand Philosophy */}
          <BrandStory eraMode={eraMode} />

          {/* SECTION F: Chaiwala Radio */}
          <EraRadio
            eraMode={eraMode}
            isPlayingAudio={isPlayingAudio}
            onToggleAudio={toggleRadioAudio}
          />

          {/* SECTION F·B: Adda sessions — evergreen video playlist, 1900s only */}
          {eraMode === '1900s' && (
            <AddaSessions
              isPlayingAudio={isPlayingAudio}
              onStart={() => {
                radioAudio.stop();
                setIsPlayingAudio(false);
              }}
            />
          )}

          {/* SECTION G: The Order Ritual */}
          <OrderRitual />
        </div>
      </main>

      {/* SECTION H: Contrasting Dark Footer */}
      <SiteFooter onSwitchEra={switchEra} />

      {/* Toast Notice */}
      {toastNotice && (
        <div className="bag-notice" role="status">
          <Check size={16} />
          <span>{toastNotice}</span>
          <button type="button" onClick={() => setCartOpen(true)}>
            View bag
          </button>
        </div>
      )}

      {/* Floating Mobile Bag Button */}
      {itemCount > 0 && (
        <button type="button" className="mobile-bag" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} />
          <span>View bag</span>
          <span className="mobile-bag-count">{itemCount}</span>
          <b>{money(grandTotalPaise)}</b>
        </button>
      )}

      {/* Product Customization Modal */}
      {customProduct && (
        <aside
          className="sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customizer-dialog-title"
          onClick={(e) => e.target === e.currentTarget && setCustomProduct(null)}
        >
          <div className="cart-sheet custom-sheet">
            <button
              type="button"
              className="close-sheet"
              aria-label="Close product customizer"
              onClick={() => setCustomProduct(null)}
            >
              <X size={20} />
            </button>

            <img className="custom-photo" src={customProduct.imagePath} alt={customProduct.imageAlt} />
            <p className="kicker">Make it yours</p>
            <h2 id="customizer-dialog-title">{customProduct.name}</h2>
            <p className="sheet-lede">{customProduct.description}</p>

            {customProduct.optionGroups?.map((group) => (
              <fieldset key={group.id}>
                <legend>
                  {group.name} <small>({group.minSelect ? 'Required' : 'Optional'})</small>
                </legend>
                <div className="option-list">
                  {group.options.map((option) => {
                    const isSelected = selectedOptions.some((o) => o.id === option.id);
                    return (
                      <label key={option.id} className={isSelected ? 'selected' : ''}>
                        <input
                          type={group.maxSelect === 1 && group.minSelect > 0 ? 'radio' : 'checkbox'}
                          name={group.id}
                          disabled={!option.isAvailable}
                          checked={isSelected}
                          onChange={() => {
                            setSelectedOptions((current) => {
                              const alreadyChosen = current.some((o) => o.id === option.id);
                              if (alreadyChosen && group.minSelect === 0) {
                                return current.filter((o) => o.id !== option.id);
                              }
                              if (group.maxSelect === 1) {
                                return [...current.filter((o) => !group.options.some((g) => g.id === o.id)), option];
                              }
                              if (alreadyChosen) {
                                return current.filter((o) => o.id !== option.id);
                              }
                              const existingGroupCount = current.filter((o) => group.options.some((g) => g.id === o.id)).length;
                              return existingGroupCount < group.maxSelect ? [...current, option] : current;
                            });
                          }}
                        />
                        <span>{option.name}</span>
                        <b>{option.priceDeltaPaise ? `+${money(option.priceDeltaPaise)}` : 'Included'}</b>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="custom-quantity">
              <span>Quantity</span>
              <div className="quantity">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => q - 1)}
                >
                  <Minus size={15} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= 20}
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <button
              type="button"
              className="primary-action wide"
              disabled={customProduct.optionGroups?.some(
                (g) => selectedOptions.filter((o) => g.options.some((opt) => opt.id === o.id)).length < g.minSelect
              )}
              onClick={() => {
                addItem(customProduct, selectedOptions, quantity);
                setCustomProduct(null);
                setToastNotice(`${quantity} × ${customProduct.name} added to your bag`);
              }}
            >
              Add to bag ·{' '}
              {money(
                (customProduct.basePricePaise +
                  selectedOptions.reduce((sum, opt) => sum + opt.priceDeltaPaise, 0)) *
                  quantity
              )}
            </button>
          </div>
        </aside>
      )}

      {/* Cart Drawer Sheet */}
      {cartOpen && (
        <aside
          className="sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-dialog-title"
          onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}
        >
          <div className="cart-sheet">
            <button
              type="button"
              className="close-sheet"
              aria-label="Close bag drawer"
              onClick={() => setCartOpen(false)}
            >
              <X size={20} />
            </button>

            <p className="kicker">Your bag</p>
            <h2 id="cart-dialog-title">
              Ready when <br />
              <i>you are.</i>
            </h2>

            {items.length ? (
              <>
                <div className="cart-lines">
                  {items.map((item) => (
                    <div className="cart-line" key={item.id}>
                      <img className="cart-line-thumb" src={item.imagePath} alt="" />
                      <div className="cart-line-info">
                        <b>{item.productName}</b>
                        <small>{item.options.map((opt) => opt.optionName).join(' · ')}</small>
                        <strong>{money(item.lineTotalPaise)}</strong>
                      </div>
                      <div className="quantity">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.productName}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.productName}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button type="button" className="remove-line" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bill">
                  <p>
                    <span>Subtotal</span>
                    <span>{money(subtotalPaise)}</span>
                  </p>
                  <p>
                    <span>GST (5%)</span>
                    <span>{money(gstPaise)}</span>
                  </p>
                  <p>
                    <span>Packaging fee</span>
                    <span>{money(packagingPaise)}</span>
                  </p>
                  <p className="bill-total">
                    <span>Total at counter</span>
                    <b>{money(grandTotalPaise)}</b>
                  </p>
                </div>

                <button
                  type="button"
                  className="primary-action wide"
                  onClick={() => {
                    setCartOpen(false);
                    setSubmitError('');
                    setCheckoutOpen(true);
                  }}
                >
                  Choose pickup slot <ChevronRight size={18} />
                </button>
              </>
            ) : (
              <div className="empty-bag">
                <p>Your bag is currently empty. Add your favorite cup from the menu.</p>
                <button
                  type="button"
                  className="primary-action wide"
                  onClick={() => {
                    setCartOpen(false);
                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Explore menu
                </button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Pickup Checkout Sheet */}
      {checkoutOpen && (
        <aside
          className="sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-dialog-title"
          onClick={(e) => e.target === e.currentTarget && !isSubmitting && setCheckoutOpen(false)}
        >
          <form className="checkout-sheet" onSubmit={submitOrder}>
            <button
              type="button"
              className="close-sheet"
              aria-label="Close checkout"
              onClick={() => setCheckoutOpen(false)}
            >
              <X size={20} />
            </button>

            <p className="kicker">Counter pickup</p>
            <h2 id="checkout-dialog-title">
              Almost <br />
              <i>there.</i>
            </h2>

            <fieldset>
              <legend>
                <Clock3 size={16} /> Choose pickup window
              </legend>
              {slotLoading && <p role="status">Checking available windows…</p>}
              {slotError && (
                <p role="alert" style={{ color: '#ef4444' }}>
                  {slotError}{' '}
                  <button type="button" onClick={() => void loadSlots()} style={{ textDecoration: 'underline' }}>
                    Retry
                  </button>
                </p>
              )}
              {!slotLoading && !slotError && !slots.length && (
                <p role="status">
                  No pickup windows available right now.{' '}
                  <button type="button" onClick={() => void loadSlots()} style={{ textDecoration: 'underline' }}>
                    Refresh
                  </button>
                </p>
              )}
              <div className="slots">
                {slots.map((slot) => (
                  <label key={slot.id} className={slotId === slot.id ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="slot"
                      checked={slotId === slot.id}
                      onChange={() => setSlotId(slot.id)}
                    />
                    <span>{formatSlot(slot)}</span>
                    <small>
                      {slot.remaining} of {slot.capacity} slots left
                    </small>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="field">
              Your Name
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name on the order ticket"
              />
            </label>

            <label className="field">
              Mobile Number
              <input
                required
                inputMode="numeric"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile number"
              />
            </label>

            <label className="field">
              Special instructions <small>(optional)</small>
              <input
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Extra hot, extra ginger, less ice, etc."
              />
            </label>

            <p className="checkout-total">
              Total · <strong>{money(grandTotalPaise)}</strong>
            </p>

            <button
              type="button"
              className="back-to-bag"
              onClick={() => {
                setCheckoutOpen(false);
                setCartOpen(true);
              }}
            >
              ← Edit bag
            </button>

            <p className="pay-note">
              {isSupabaseConfigured
                ? 'Pay cash or UPI directly at the café counter upon collection.'
                : 'Demo mode · Order is simulated on this device. Pay cash or UPI at the counter.'}
            </p>

            {submitError && (
              <p className="form-error" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="primary-action wide"
              disabled={isSubmitting || slotLoading || !slotId || !!slotError}
            >
              {isSubmitting ? 'Placing your order…' : `Confirm Order · ${money(grandTotalPaise)}`}
            </button>
          </form>
        </aside>
      )}

      {/* Confirmation Ticket Dialog */}
      {confirmation && (
        <aside className="sheet-backdrop confirmation-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirmation-dialog-title">
          <div className="confirmation">
            <div className="ticket-check">
              <Check size={28} />
            </div>
            <p className="kicker">{isSupabaseConfigured ? 'Order sent to the counter' : 'Demo order confirmed'}</p>
            <h2 id="confirmation-dialog-title">
              Your table. <br />
              <i>Your ticket.</i>
            </h2>
            <p>
              Order Ticket <b>{confirmation.displayNumber}</b> is ready! Show this ticket number at the counter to collect your warm brew.
            </p>
            <p className="tracking">Tracking reference: {confirmation.trackingToken}</p>
            <button type="button" className="primary-action wide" onClick={() => setConfirmation(null)}>
              Back to Chaiwala
            </button>
          </div>
        </aside>
      )}

      {/* SaaS-Grade Dynamic Island Bottom Player with Ambient Aura */}
      <DynamicIslandPlayer />

      {/* Immersive Theatre Mode Overlay with Synchronized Lyrics */}
      <TheatreModeOverlay state={audioState} />
    </div>
  );
};

export default OrderPage;
