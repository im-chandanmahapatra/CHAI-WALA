import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, RefreshCw, XCircle, AlertCircle, MapPin, Coffee, PhoneCall } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { Order } from '../lib/database.types';
import { OrderTicket } from '../components/order/OrderTicket';
import { StatusStepper } from '../components/order/StatusStepper';
import { EstimateBadge } from '../components/order/EstimateBadge';

export const TrackingPage: React.FC = () => {
  const { trackingToken } = useParams<{ trackingToken: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrder = async (isInitial = false) => {
    if (!trackingToken) return;
    if (isInitial) setLoading(true);
    else setIsRefreshing(true);

    try {
      const { data, error: rpcError } = await supabase.rpc('get_order_tracking', {
        p_token: trackingToken,
      });

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      if (data) {
        setOrder((prev) => {
          // If status moved to READY_FOR_PICKUP, trigger celebratory confetti!
          if (prev && prev.status !== 'READY_FOR_PICKUP' && data.status === 'READY_FOR_PICKUP') {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          }
          return data as Order;
        });
        setError(null);
      } else {
        setError('Order chit not found. Please check your tracking link.');
      }
    } catch (err: any) {
      if (isInitial) {
        setError(err.message || 'Failed to retrieve order tracking.');
      }
    } finally {
      if (isInitial) setLoading(false);
      else setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchOrder(true);

    // Polling setup: 8s interval, pauses when tab is hidden, halts at terminal status
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && order && !order.isTerminal) {
        fetchOrder(false);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [trackingToken, order?.isTerminal]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setIsCancelling(true);

    try {
      const { error: cancelError } = await supabase.rpc('transition_order_status', {
        p_order_id: order.id,
        p_to_status: 'CANCELLED',
        p_reason: 'Customer requested cancellation via tracking page.',
      });

      if (cancelError) throw new Error(cancelError.message);

      setCancelModalOpen(false);
      fetchOrder(false);
    } catch (err: any) {
      alert(`Could not cancel order: ${err.message}`);
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--linen)] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--terracotta)] border-t-transparent animate-spin mx-auto" />
          <h3 className="font-serif font-semibold text-xl text-[var(--dark-roast)]">
            Loading Your Chaiwala Slip...
          </h3>
          <p className="text-xs text-[var(--clay)] font-sans">
            Connecting with live kitchen counter #01
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[var(--linen)] py-20 px-4 text-center max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FFF0F0] border border-[#E5484D]/30 text-[#E5484D] flex items-center justify-center mx-auto shadow-[var(--shadow-warm-sm)]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-2xl text-[var(--dark-roast)]">Tracking Link Unrecognized</h2>
          <p className="text-xs text-[var(--clay)] mt-2 leading-relaxed">
            {error || "We could not find an active or historical order matching this chit token."}
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-block px-6 py-3 bg-[var(--terracotta)] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#85321D] transition-colors shadow-[var(--shadow-warm-sm)]"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const canCustomerCancel =
    order.status === 'PENDING_CONFIRMATION' || order.status === 'CONFIRMED';

  return (
    <div className="min-h-screen bg-[var(--linen)] py-10 px-4 sm:px-6 pb-28">
      <div className="max-w-2xl mx-auto space-y-7">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--clay)] hover:text-[var(--terracotta)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Order Another Chai</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--clay)] bg-[var(--parchment)] px-2.5 py-1 rounded-full border border-[var(--warm-border)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Kitchen Sync
            </span>
            <button
              onClick={() => fetchOrder(false)}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg border border-[var(--warm-border)] bg-[var(--parchment)] text-[var(--clay)] hover:text-[var(--terracotta)] transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh order status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--terracotta)]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Stepper */}
        <StatusStepper status={order.status} statusReason={order.statusReason} />

        {/* Dynamic Queue Estimate Badge */}
        <EstimateBadge estimate={order.estimate} status={order.status} />

        {/* Physical Digital Order Ticket */}
        <OrderTicket order={order} />

        {/* Counter Collection Instructions */}
        <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-5 space-y-3 shadow-[var(--shadow-warm-sm)]">
          <div className="flex items-center gap-2 text-[var(--dark-roast)]">
            <MapPin className="w-4 h-4 text-[var(--terracotta)] shrink-0" />
            <h4 className="font-serif font-semibold text-sm">Pickup Instructions</h4>
          </div>
          <p className="text-xs text-[var(--clay)] leading-relaxed">
            Head to <strong className="text-[var(--dark-roast)]">Chaiwala Counter #01</strong> at your chosen slot. Mention your 4-digit token <strong className="text-[var(--terracotta)] font-serif font-bold">{order.displayNumber}</strong>. Hot kettle decoctions are prepared fresh to order and best enjoyed within 15 minutes of completion.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-[var(--clay)] border-t border-[var(--warm-border)]">
            <span className="inline-flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-[var(--brass)]" />
              Brass Kettle Brewed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[var(--brass)]" />
              Counter Hotline: +91 98200 12345
            </span>
          </div>
        </div>

        {/* Customer Cancellation Action */}
        {canCustomerCancel && (
          <div className="text-center pt-2">
            <button
              onClick={() => setCancelModalOpen(true)}
              className="text-xs text-[#E5484D] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Need to cancel this order?</span>
            </button>
          </div>
        )}

        {/* Confirmation Modal for Cancellation */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
              <h4 className="font-serif font-bold text-lg text-[var(--dark-roast)]">Cancel Order?</h4>
              <p className="text-xs text-[var(--clay)] leading-relaxed">
                Are you sure you want to cancel order <span className="font-semibold text-[var(--dark-roast)]">{order.displayNumber}</span>? Your reserved pickup slot will be immediately released to other waiting customers.
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  disabled={isCancelling}
                  className="px-4 py-2 border border-[var(--warm-border)] rounded-xl text-xs font-semibold text-[var(--dark-roast)] hover:bg-[var(--linen)] transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-[#E5484D] text-white rounded-xl text-xs font-semibold hover:bg-[#C93B40] transition-colors shadow-xs"
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
