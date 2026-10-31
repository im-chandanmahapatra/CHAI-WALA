import React from 'react';
import { Clock, MapPin, IndianRupee, QrCode } from 'lucide-react';
import { Order } from '../../lib/database.types';

interface OrderTicketProps {
  order: Order;
}

export const OrderTicket: React.FC<OrderTicketProps> = ({ order }) => {
  const slotDate = new Date(order.pickupSlot.startsAt).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const slotStart = new Date(order.pickupSlot.startsAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const slotEnd = new Date(order.pickupSlot.endsAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="relative max-w-md mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-card overflow-hidden">
      {/* Top Perforation / Ticket Header */}
      <div className="bg-[var(--surface-subtle)] border-b border-dashed border-[var(--border)] p-6 text-center relative">
        <div className="flex items-center justify-between text-[10px] font-bold text-[var(--ink-muted)] mb-2 uppercase tracking-widest">
          <span>Counter Token Slip</span>
          <span>चायवाला · Counter 01</span>
        </div>

        {/* Big Serial Ticket Number */}
        <span className="font-display font-black text-4xl sm:text-5xl text-[var(--primary)] tracking-wider block font-tabular">
          {order.displayNumber}
        </span>

        <span className="text-xs text-[var(--ink-muted)] block mt-1.5 font-medium">
          Reserved for: <span className="font-bold text-[var(--ink)]">{order.customerName}</span> · {order.customerPhone}
        </span>

        {/* Rubber Stamp Status Seal */}
        <div className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[var(--primary)] bg-white text-[var(--primary)] font-display font-bold text-xs uppercase tracking-wider shadow-stamp">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          <span>{order.statusLabel}</span>
        </div>
      </div>

      {/* Perforation Cut Holes */}
      <div className="relative h-4 bg-[var(--surface)] flex items-center justify-between">
        <div className="w-4 h-4 rounded-full bg-[var(--bg)] -ml-2 border-r border-[var(--border)]" />
        <div className="flex-1 border-t-2 border-dashed border-[var(--border-subtle)] mx-2" />
        <div className="w-4 h-4 rounded-full bg-[var(--bg)] -mr-2 border-l border-[var(--border)]" />
      </div>

      {/* Body: Pickup Slot Details */}
      <div className="p-6 space-y-5">
        <div className="bg-[var(--surface-subtle)] border border-[var(--border)] rounded-2xl p-4 flex items-center justify-between shadow-stamp">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[var(--primary)]" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--ink-muted)] block">
                Collection Slot Window
              </span>
              <span className="font-display font-bold text-sm text-[var(--ink)] block">
                {slotDate} · {slotStart} – {slotEnd}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            Reserved
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--ink-muted)] block border-b border-[var(--border-subtle)] pb-1.5">
            Artisanal Recipes ({order.items.length})
          </span>
          <div className="divide-y divide-[var(--border-subtle)]">
            {order.items.map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 flex items-start justify-between text-xs">
                <div>
                  <div className="font-display font-bold text-sm text-[var(--ink)]">
                    {item.quantity}× {item.productName}
                  </div>
                  {item.options.length > 0 && (
                    <div className="text-[11px] text-[var(--ink-muted)] mt-0.5">
                      {item.options.map((o) => `${o.groupName}: ${o.optionName}`).join(' · ')}
                    </div>
                  )}
                </div>
                <span className="font-display font-bold text-[var(--ink)] font-tabular">
                  ₹{(item.lineTotalPaise / 100).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="ticket-divider" />

        {/* Financial Breakdown */}
        <div className="space-y-1.5 text-xs text-[var(--ink-muted)]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-tabular text-[var(--ink)]">₹{(order.subtotalPaise / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>F&B GST (5%)</span>
            <span className="font-tabular text-[var(--ink)]">
              ₹{(Math.round(order.subtotalPaise * 0.05) / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Eco-Kulhad & Box</span>
            <span className="font-tabular text-[var(--ink)]">₹10.00</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[var(--border-subtle)] text-sm font-bold text-[var(--ink)]">
            <span>Total Payable at Pickup</span>
            <span className="font-display font-black text-lg text-[var(--primary)] font-tabular">
              ₹{(order.totalPaise / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Counter Instructions */}
        <div className="p-4 rounded-2xl bg-[var(--surface-subtle)] border border-[var(--border)] text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink)] block">
            Counter Collection Instructions
          </span>
          <p className="text-[11px] text-[var(--ink-muted)] leading-relaxed font-body">
            Please show this digital token or state ticket <span className="font-bold text-[var(--primary)]">{order.displayNumber}</span> at Counter #01 upon arrival. Pay with cash or any UPI app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTicket;
