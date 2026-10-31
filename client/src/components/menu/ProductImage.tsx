import React, { useState } from 'react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  name: string;
  categoryName?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  name,
  categoryName,
  className = '',
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full aspect-[4/5] bg-[var(--surface)] border-b border-[var(--border)] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />
        <div className="w-16 h-16 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center shadow-stamp mb-2 z-10">
          <span className="font-display font-bold text-3xl text-[var(--primary)]">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-display font-bold text-sm text-[var(--ink)] z-10 line-clamp-1">{name}</span>
        {categoryName && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--ink-muted)] mt-1 z-10">
            {categoryName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full aspect-[4/5] overflow-hidden bg-[var(--surface)] relative border-b border-[var(--border)] ${className}`}>
      {/* Skeleton / Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[var(--surface)] animate-pulse flex items-center justify-center">
          <span className="font-display font-bold text-2xl text-[var(--ink-muted)] opacity-30">
            {name.charAt(0)}
          </span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
