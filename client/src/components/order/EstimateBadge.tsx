import React from 'react';
import { Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { OrderEstimate, OrderStatus } from '../../lib/database.types';

interface EstimateBadgeProps {
  estimate: OrderEstimate | null;
  status: OrderStatus;
}

export const EstimateBadge: React.FC<EstimateBadgeProps> = ({ estimate, status }) => {
  if (status === 'READY_FOR_PICKUP') {
    return (
      <div className="bg-[#EDF7ED] border border-[#2E7D32]/30 text-[#1B5E20] p-4 rounded-xl shadow-[var(--shadow-warm-sm)] text-center flex items-center justify-center gap-2.5">
        <Sparkles className="w-5 h-5 text-[#2E7D32] animate-pulse" />
        <span className="font-serif font-semibold text-sm">
          Your order is hot and waiting at Counter #01!
        </span>
      </div>
    );
  }

  if (['COMPLETED', 'REJECTED', 'CANCELLED'].includes(status) || !estimate || !estimate.readyAt) {
    return null;
  }

  const estTime = new Date(estimate.readyAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`border rounded-xl p-4 flex items-start gap-3.5 shadow-[var(--shadow-warm-sm)] ${
        estimate.isLate
          ? 'bg-[#FFF9E6] border-[#DDB34F]/50 text-[var(--dark-roast)]'
          : 'bg-[var(--parchment)] border-[var(--warm-border)] text-[var(--dark-roast)]'
      }`}
    >
      <div className="p-2 rounded-lg bg-[var(--linen)] border border-[var(--warm-border)] shrink-0">
        {estimate.isLate ? (
          <AlertTriangle className="w-4 h-4 text-[#B78103]" />
        ) : (
          <Clock className="w-4 h-4 text-[var(--terracotta)]" />
        )}
      </div>

      <div className="flex-1 space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--clay)]">
            Kitchen Queue Estimate
          </span>
          {estimate.isLate && (
            <span className="text-[10px] font-bold text-[#B78103] uppercase tracking-wider">
              Queue Delay
            </span>
          )}
        </div>
        <p className="font-serif font-medium text-base text-[var(--dark-roast)]">
          Estimated ready around <span className="font-semibold text-[var(--terracotta)]">{estTime}</span>
        </p>
        <p className="text-xs text-[var(--clay)] leading-relaxed">
          {estimate.note && !estimate.note.startsWith('Estimated ready around')
            ? estimate.note
            : 'Calculated in real-time based on active barista orders and live stove decoction timing.'}
        </p>
      </div>
    </div>
  );
};
