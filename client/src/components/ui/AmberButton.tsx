import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { useCursor } from '../../hooks/useCursorContext';

interface AmberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const AmberButton: React.FC<AmberButtonProps> = ({
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
    md: 'px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wider',
    lg: 'px-8 py-4 text-sm sm:text-base font-bold tracking-widest',
  };

  return (
    <button
      disabled={disabled}
      onMouseEnter={(e) => {
        setCursorVariant('button');
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setCursorVariant('default');
        onMouseLeave?.(e);
      }}
      className={clsx(
        'relative group inline-flex items-center justify-center gap-2 rounded-full font-body uppercase transition-all duration-300 select-none overflow-hidden',
        'bg-gradient-to-r from-[#E8A24A] via-[#F5B563] to-[#E8A24A] text-[#0E0A07]',
        'shadow-[0_4px_20px_rgba(232,162,74,0.35)] hover:shadow-[0_6px_28px_rgba(232,162,74,0.55)]',
        'active:scale-[0.98] hover:scale-[1.02]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {/* Light sheen animation sweep */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      
      <span className="relative z-10 flex items-center gap-2 font-bold tracking-wider">
        {children}
        {icon && <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>}
      </span>
    </button>
  );
};
