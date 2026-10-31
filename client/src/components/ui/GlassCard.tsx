import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative rounded-2xl bg-[#17100B]/80 backdrop-blur-xl border border-white/[0.08] p-6 text-[#F6EBDD] overflow-hidden transition-all duration-300',
        hoverEffect && 'hover:border-[#E8A24A]/30 hover:bg-[#1F1710]/90 hover:shadow-[0_8px_30px_rgba(14,10,7,0.8)] cursor-pointer',
        className
      )}
    >
      {/* Subtle top glare line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
