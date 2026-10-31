import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Shield, RefreshCw, CheckCircle2, Flame, Bell, Ban, LogOut, Coffee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Order, OrderStatus } from '../../lib/database.types';

export const AdminBoardPage: React.FC = () => {
  const { isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ACTIVE');

  // Reject / Cancel Modal state
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select();
    if (data) {
      setOrders(data as Order[]);
    }
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 8000); // 8s auto-refresh
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const handleTransition = async (orderId: string, toStatus: OrderStatus, reason?: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc('transition_order_status', {
        p_order_id: orderId,
        p_to_status: toStatus,
        p_reason: reason || undefined,
      });

      if (error) {
        alert(`Transition error: ${error.message}`);
      } else {
        fetchOrders();
        setRejectingOrder(null);
        setRejectReason('');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ACTIVE') {
      return ['PENDING_CONFIRMATION', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP'].includes(o.status);
    }
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-[var(--linen)] pb-24 text-[var(--dark-roast)]">
      {/* Top Admin Bar */}
      <header className="bg-[var(--parchment)] border-b border-[var(--warm-border)] py-3.5 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--terracotta)] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg text-[var(--dark-roast)] leading-tight">
                  CHAIWALA
                </h1>
                <span className="text-[10px] text-[var(--clay)] font-devanagari font-normal">
                  (चायवाला)
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--linen)] text-[var(--terracotta)] border border-[var(--warm-border)]">
                  KDS Fulfilment
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--clay)]">
                Live Kitchen Counter #01
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/admin/menu"
              className="px-3 py-1.5 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-xs font-semibold hover:text-[var(--terracotta)] flex items-center gap-1.5 transition-colors"
            >
              <Coffee className="w-3.5 h-3.5 text-[var(--brass)]" />
              <span className="hidden sm:inline">Stock Manager</span>
            </Link>

            <button
              onClick={() => fetchOrders()}
              className="p-1.5 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-[var(--clay)] hover:text-[var(--terracotta)] transition-colors cursor-pointer"
              title="Manual Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              className="px-3 py-1.5 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-xs font-semibold text-[var(--clay)] hover:text-[#E5484D] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Filter Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--parchment)] p-2 rounded-2xl border border-[var(--warm-border)] shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { key: 'ACTIVE', label: 'Active Queue' },
              { key: 'PENDING_CONFIRMATION', label: 'New / Pending' },
              { key: 'CONFIRMED', label: 'Confirmed' },
              { key: 'PREPARING', label: 'Preparing' },
              { key: 'READY_FOR_PICKUP', label: 'Ready at Counter' },
              { key: 'COMPLETED', label: 'Completed' },
              { key: 'ALL', label: 'All Orders' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === tab.key
                    ? 'bg-[var(--terracotta)] text-white shadow-xs'
                    : 'text-[var(--clay)] hover:text-[var(--dark-roast)] hover:bg-[var(--linen)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-[var(--clay)] px-3">
            Showing {filteredOrders.length} orders
          </span>
        </div>

        {/* Orders Grid / Kanban Stream */}
        {loadingOrders ? (
          <div className="py-20 text-center text-xs text-[var(--clay)] animate-pulse">
            Syncing order tickets from Postgres...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center max-w-sm mx-auto space-y-2 bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-8 shadow-xs">
            <h3 className="font-serif font-bold text-base text-[var(--dark-roast)]">No Active Orders</h3>
            <p className="text-xs text-[var(--clay)] leading-relaxed">
              All incoming customer orders for this queue have been fulfilled.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const slotTime = `${new Date(order.pickupSlot.startsAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })} – ${new Date(order.pickupSlot.endsAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`;

              return (
                <div
                  key={order.id}
                  className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl p-5 shadow-[var(--shadow-warm-sm)] flex flex-col justify-between space-y-4 relative"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-serif font-black text-2xl text-[var(--terracotta)] block">
                          {order.displayNumber}
                        </span>
                        <span className="text-xs font-semibold text-[var(--dark-roast)] block">
                          {order.customerName} · {order.customerPhone}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          order.status === 'READY_FOR_PICKUP'
                            ? 'bg-[#EDF7ED] text-[#1B5E20] border-[#2E7D32]/30'
                            : order.status === 'PREPARING'
                            ? 'bg-[var(--linen)] text-[var(--brass)] border-[var(--warm-border)]'
                            : order.status === 'CONFIRMED'
                            ? 'bg-[#FFF9E6] text-[#B78103] border-[#DDB34F]/40'
                            : order.status === 'PENDING_CONFIRMATION'
                            ? 'bg-[var(--terracotta)]/10 text-[var(--terracotta)] border-[var(--terracotta)]/30'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {order.statusLabel}
                      </span>
                    </div>

                    {/* Slot Indicator */}
                    <div className="mt-3 p-2.5 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-xs flex justify-between">
                      <span className="text-[var(--clay)] font-medium">Pickup Slot:</span>
                      <span className="font-semibold text-[var(--dark-roast)]">{slotTime}</span>
                    </div>

                    {/* Items List */}
                    <div className="mt-3 divide-y divide-[var(--warm-border)] border-t border-[var(--warm-border)] pt-2 text-xs space-y-2">
                      {order.items.map((it, i) => (
                        <div key={i} className="pt-2 flex justify-between">
                          <div>
                            <span className="font-semibold text-[var(--dark-roast)]">
                              {it.quantity}× {it.productName}
                            </span>
                            {it.options.length > 0 && (
                              <p className="text-[10px] text-[var(--clay)]">
                                {it.options.map((o) => o.optionName).join(' · ')}
                              </p>
                            )}
                          </div>
                          <span className="font-semibold text-[var(--dark-roast)] ml-2">
                            ₹{(it.lineTotalPaise / 100).toFixed(0)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Customer Note */}
                    {order.customerNote && (
                      <div className="mt-3 p-2.5 bg-[#FFF9E6] border border-[#DDB34F]/40 rounded-xl text-xs text-[var(--dark-roast)] italic">
                        Note: "{order.customerNote}"
                      </div>
                    )}
                  </div>

                  {/* Actions & Price Footer */}
                  <div className="pt-3 border-t border-[var(--warm-border)] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--clay)] block">
                        Cash Due
                      </span>
                      <span className="font-serif font-bold text-lg text-[var(--dark-roast)]">
                        ₹{(order.totalPaise / 100).toFixed(0)}
                      </span>
                    </div>

                    {/* State Transition Actions */}
                    <div className="flex items-center gap-1.5">
                      {order.status === 'PENDING_CONFIRMATION' && (
                        <>
                          <button
                            onClick={() => setRejectingOrder(order)}
                            className="px-2.5 py-1.5 bg-[#FFF0F0] text-[#E5484D] border border-[#E5484D]/30 rounded-xl text-xs font-semibold hover:bg-[#FFE5E5] transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleTransition(order.id, 'CONFIRMED')}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 bg-[var(--terracotta)] text-white rounded-xl text-xs font-semibold hover:bg-[#85321D] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                        </>
                      )}

                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleTransition(order.id, 'PREPARING')}
                          disabled={isProcessing}
                          className="px-3.5 py-1.5 bg-[var(--brass)] text-white rounded-xl text-xs font-semibold hover:bg-[#B38332] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>Start Brewing</span>
                        </button>
                      )}

                      {order.status === 'PREPARING' && (
                        <button
                          onClick={() => handleTransition(order.id, 'READY_FOR_PICKUP')}
                          disabled={isProcessing}
                          className="px-3.5 py-1.5 bg-[#2E7D32] text-white rounded-xl text-xs font-semibold hover:bg-[#256629] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>Mark Ready</span>
                        </button>
                      )}

                      {order.status === 'READY_FOR_PICKUP' && (
                        <button
                          onClick={() => handleTransition(order.id, 'COMPLETED')}
                          disabled={isProcessing}
                          className="px-3.5 py-1.5 bg-[var(--dark-roast)] text-white rounded-xl text-xs font-semibold hover:bg-black transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Handover & Paid</span>
                        </button>
                      )}

                      {order.isTerminal && (
                        <span className="text-xs font-semibold text-[var(--clay)] italic">
                          Archived Slip
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[var(--parchment)] border border-[var(--warm-border)] rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#E5484D]">
              <Ban className="w-5 h-5" />
              <h4 className="font-serif font-bold text-lg">Reject Order {rejectingOrder.displayNumber}</h4>
            </div>
            <p className="text-xs text-[var(--clay)] leading-relaxed">
              A clear reason is required and will be displayed on the customer's live tracking chit.
            </p>
            <textarea
              required
              rows={3}
              placeholder="e.g. Fresh milk out of stock, kitchen closing early..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 bg-[var(--linen)] border border-[var(--warm-border)] rounded-xl text-xs text-[var(--dark-roast)] focus:outline-none focus:border-[var(--terracotta)]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 border border-[var(--warm-border)] rounded-xl text-xs font-semibold text-[var(--dark-roast)] hover:bg-[var(--linen)]"
              >
                Back
              </button>
              <button
                disabled={!rejectReason.trim() || isProcessing}
                onClick={() =>
                  handleTransition(rejectingOrder.id, 'REJECTED', rejectReason.trim())
                }
                className="px-4 py-2 bg-[#E5484D] text-white rounded-xl text-xs font-semibold hover:bg-[#C93B40] transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
