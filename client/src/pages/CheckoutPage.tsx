import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Clock, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { PickupSlot } from '../lib/database.types';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const CheckoutPage: React.FC = () => {
  const { items, subtotalPaise, clearCart } = useCart();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  // Slots State
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Financial Breakdown
  const gstPaise = Math.round(subtotalPaise * 0.05);
  const packagingPaise = items.length > 0 ? 1000 : 0;
  const totalPaise = subtotalPaise + gstPaise + packagingPaise;

  useEffect(() => {
    // Fetch available slots from backend
    (supabase as any)
      .from('pickup_slots')
      .select()
      .then(({ data }: any) => {
        if (data) {
          setSlots(data as PickupSlot[]);
          // Default select first available slot with remaining capacity
          const firstAvail = (data as PickupSlot[]).find(
            (s) => s.status === 'AVAILABLE' && s.remaining > 0
          );
          if (firstAvail) setSelectedSlotId(firstAvail.id);
        }
        setLoadingSlots(false);
      });
  }, []);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full name for counter ticket pickup.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian phone number (e.g. 9820012345).');
      return;
    }
    if (!selectedSlotId) {
      setErrorMessage('Please select a 15-minute pickup collection window.');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your order bag is empty. Please add items before placing order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const cleanPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '');

      // Format payload for create_order RPC
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          optionIds: i.options.map((o) => o.optionId),
        })),
        pickupSlotId: selectedSlotId,
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          note: note.trim() || undefined,
        },
        idempotencyKey,
      };

      const { data, error } = await supabase.rpc('create_order', orderPayload as any);

      if (error) {
        setErrorMessage(error.message || 'Failed to reserve order ticket. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (data && data.trackingToken) {
        clearCart();
        navigate(`/order/${data.trackingToken}`);
      } else {
        throw new Error('Unexpected response format from order creation RPC.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected network error occurred.');
      setIsSubmitting(false);
    }
  };

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 pb-28">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header & Back Link */}
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-6">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </Link>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)] block">
                Counter #01 Pickup
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[var(--ink)]">
                Reserve Your Warm Slot
              </h1>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-card">
              <div className="w-16 h-16 rounded-full bg-[var(--surface-subtle)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--ink-muted)] shadow-stamp">
                <ShoppingBag className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <h3 className="font-display font-black text-xl text-[var(--ink)]">Your tray is empty</h3>
              <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-body">
                Please add at least one chai or bakery item before proceeding to pickup reservation.
              </p>
              <Link
                to="/menu"
                className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-card"
              >
                Return to Menu
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: 15-Minute Slot Selection & Customer Details */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Step 1: 15-Minute Pickup Window Selection */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
                    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)] block">
                          Step 1 of 2
                        </span>
                        <h2 className="font-display font-black text-xl text-[var(--ink)]">
                          Select 15-Minute Collection Window
                        </h2>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)] font-medium">
                        <Clock className="w-4 h-4 text-[var(--primary)]" />
                        <span>Freshly Boiled</span>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-body">
                      We calibrate our brass boiling kettles to your selected window. Arrive at Counter #01 within this 15-minute slot to collect your order steaming warm.
                    </p>

                    {loadingSlots ? (
                      <div className="py-8 text-center text-xs text-[var(--ink-muted)] animate-pulse">
                        Checking live counter capacity...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slots.map((slot) => {
                          const startDate = new Date(slot.startsAt);
                          const endDate = new Date(slot.endsAt);
                          const timeRange = `${startDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })} – ${endDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}`;

                          const isSelected = selectedSlotId === slot.id;
                          const isFull = slot.status === 'FULL' || slot.remaining <= 0;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={isFull}
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                                isFull
                                  ? 'opacity-40 cursor-not-allowed bg-[var(--surface-subtle)] border-transparent'
                                  : isSelected
                                  ? 'bg-[var(--mood-bg-subtle)] border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-card'
                                  : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-subtle)] shadow-stamp'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="font-display font-bold text-xs text-[var(--ink)] block">
                                  {timeRange}
                                </span>
                                <span className="text-[10px] text-[var(--ink-muted)] block font-tabular">
                                  {isFull
                                    ? 'Fully Booked'
                                    : slot.remaining <= 2
                                    ? `Only ${slot.remaining} slots left`
                                    : `${slot.remaining} slots available`}
                                </span>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    isFull
                                      ? 'bg-red-50 text-red-700'
                                      : slot.remaining <= 2
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-emerald-50 text-emerald-800'
                                  }`}
                                >
                                  {isFull ? 'Full' : slot.remaining <= 2 ? 'Filling Fast' : 'Available'}
                                </span>
                                {isSelected && (
                                  <div className="w-4 h-4 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step 2: Customer Contact & Pickup Details */}
                  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
                    <div className="border-b border-[var(--border-subtle)] pb-4">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)] block">
                        Step 2 of 2
                      </span>
                      <h2 className="font-display font-black text-xl text-[var(--ink)]">
                        Patron Identification
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[var(--ink)] block">
                          Full Name <span className="text-[var(--primary)]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Aarav Patel"
                          className="w-full px-4 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[var(--ink)] block">
                          Phone Number <span className="text-[var(--primary)]">*</span>
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[var(--border)] bg-[var(--surface-subtle)] text-xs text-[var(--ink-muted)] font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="98200 12345"
                            className="w-full px-4 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-r-xl text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--ink)] block">
                        Special Instructions or Allergies (Optional)
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g. Extra hot chai, pack separately in bag"
                        className="w-full px-4 py-2.5 bg-[var(--surface-subtle)] border border-[var(--border)] rounded-xl text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-display font-bold text-xs text-[var(--ink)] block">
                          Pay Cash or UPI at Counter #01
                        </span>
                        <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed font-body">
                          We do not charge your card online. Simply show your digital ticket number when collecting your warm tray.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Summary Chit */}
                <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
                  <div className="border-b border-[var(--border-subtle)] pb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary)] block">
                        Tray Summary
                      </span>
                      <h3 className="font-display font-black text-xl text-[var(--ink)]">
                        {items.length} {items.length === 1 ? 'Recipe' : 'Recipes'}
                      </h3>
                    </div>
                    {selectedSlot && (
                      <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--surface-subtle)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                        Window: {new Date(selectedSlot.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {/* Line Items List */}
                  <div className="divide-y divide-[var(--border-subtle)] max-h-72 overflow-y-auto pr-1 space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-start text-xs">
                        <div>
                          <div className="font-display font-bold text-sm text-[var(--ink)]">
                            {item.quantity}× {item.productName}
                          </div>
                          {item.options.length > 0 && (
                            <div className="text-[10px] text-[var(--ink-muted)] mt-0.5">
                              {item.options.map((o) => o.optionName).join(' · ')}
                            </div>
                          )}
                        </div>
                        <span className="font-display font-bold text-[var(--ink)] font-tabular">
                          ₹{(item.lineTotalPaise / 100).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Perforated Divider */}
                  <div className="ticket-divider" />

                  {/* Billing Breakdown */}
                  <div className="space-y-2 text-xs text-[var(--ink-muted)]">
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
                    <div className="flex justify-between pt-3 border-t border-[var(--border-subtle)] text-base font-bold text-[var(--ink)]">
                      <span>Amount Due at Counter</span>
                      <span className="font-display font-black text-xl text-[var(--primary)] font-tabular">
                        ₹{(totalPaise / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-card shadow-card-hover transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Reserving Counter Slot...</span>
                    ) : (
                      <>
                        <span>Confirm & Place Pickup Order</span>
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
