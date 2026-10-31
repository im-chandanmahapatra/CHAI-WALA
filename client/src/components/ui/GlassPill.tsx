import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface GlassPillProps {
  children: ReactNode;
  variant?: 'amber' | 'neutral' | 'spice' | 'leaf';
  className?: string;
  icon?: ReactNode;
}

export const GlassPill: React.FC<GlassPillProps> = ({
  children,
  variant = 'amber',
  className = '',
  icon,
}) => {
  const variantStyles = {
    amber: 'bg-[#E8A24A]/10 border-[#E8A24A]/25 text-[#FFC875]',
    neutral: 'bg-white/[0.04] border-white/10 text-[#F6EBDD]/90',
    spice: 'bg-[#C4552D]/15 border-[#C4552D]/30 text-[#FFA07A]',
    leaf: 'bg-[#7C9A5E]/15 border-[#7C9A5E]/30 text-[#A8D584]',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide backdrop-blur-md border transition-colors duration-200',
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="flex-shrink-0 opacity-80">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
