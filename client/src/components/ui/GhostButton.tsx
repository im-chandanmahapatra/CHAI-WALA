import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { useCursor } from '../../hooks/useCursorContext';

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const GhostButton: React.FC<GhostButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const { setCursorVariant } = useCursor();

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-semibold tracking-wider',
    md: 'px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wider',
    lg: 'px-8 py-4 text-sm sm:text-base font-bold tracking-widest',
  };

  return (
    <button
      disabled={disabled}
      onMouseEnter={(e) => {
        setCursorVariant('pointer');
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setCursorVariant('default');
        onMouseLeave?.(e);
      }}
      className={clsx(
        'relative inline-flex items-center justify-center gap-2 rounded-full font-body uppercase transition-all duration-300 select-none',
        'bg-white/[0.04] hover:bg-white/[0.08] text-[#F6EBDD] border border-white/[0.12] hover:border-[#E8A24A]/40',
        'backdrop-blur-md active:scale-[0.98]',
        'disabled:opacity-40 disabled:pointer-events-none',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {icon && <span className="opacity-80 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
      </span>
    </button>
  );
};
