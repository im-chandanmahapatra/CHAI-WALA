import React from 'react';
import { Check, Clock, Flame, Bell, CheckCircle2, XCircle } from 'lucide-react';
import { OrderStatus } from '../../lib/database.types';

interface StatusStepperProps {
  status: OrderStatus;
  statusReason?: string | null;
}

export const StatusStepper: React.FC<StatusStepperProps> = ({ status, statusReason }) => {
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center space-y-1.5 shadow-stamp">
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2">
          <XCircle className="w-5 h-5" />
        </div>
        <h4 className="font-display font-bold text-base text-red-700">
          {status === 'REJECTED' ? 'Order Declined by Kitchen' : 'Order Cancelled'}
        </h4>
        {statusReason && (
          <p className="text-xs text-[var(--ink-muted)]">
            Reason: <span className="font-semibold text-[var(--ink)]">{statusReason}</span>
          </p>
        )}
        <p className="text-[11px] text-[var(--ink-muted)] pt-1">
          Pickup slot capacity has been automatically restored.
        </p>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'PENDING_CONFIRMATION', label: 'Placed', icon: <Clock className="w-3.5 h-3.5" /> },
    { key: 'CONFIRMED', label: 'Accepted', icon: <Check className="w-3.5 h-3.5" /> },
    { key: 'PREPARING', label: 'Brewing', icon: <Flame className="w-3.5 h-3.5" /> },
    { key: 'READY_FOR_PICKUP', label: 'Ready!', icon: <Bell className="w-3.5 h-3.5" /> },
    { key: 'COMPLETED', label: 'Collected', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  const getStepIndex = (s: OrderStatus) => {
    switch (s) {
      case 'PENDING_CONFIRMATION':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PREPARING':
        return 2;
      case 'READY_FOR_PICKUP':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-stamp">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">
          Live Kitchen Fulfillment Progress
        </span>
        <span className="text-[11px] font-bold text-[var(--ink)] font-tabular">
          Step {currentIndex + 1} of {steps.length}
        </span>
      </div>

      <div className="relative">
        {/* Connecting Progress Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-[var(--border-subtle)] -z-0">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-700 ease-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        <div className="relative z-10 flex justify-between items-start">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center max-w-[70px]">
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 relative ${
                    isCurrent
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-stamp scale-110 ring-4 ring-[var(--primary)]/15'
                      : isCompleted
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-stamp'
                      : 'bg-[var(--surface-subtle)] text-[var(--ink-muted)] border-[var(--border)]'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.icon}
                </div>
                <span
                  className={`text-[10px] mt-2 font-bold leading-tight font-display ${
                    isCurrent ? 'text-[var(--primary)] font-black' : isCompleted ? 'text-[var(--ink)]' : 'text-[var(--ink-muted)]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusStepper;
