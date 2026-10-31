import React from 'react';
import { motion } from 'motion/react';
import { Category } from '../../lib/database.types';

interface StickyCategoryBarProps {
  categories: Category[];
  selectedCategory: string; // 'all' or category slug
  onSelectCategory: (slug: string) => void;
}

export const StickyCategoryBar: React.FC<StickyCategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = [
    { id: 'cat-all', slug: 'all', name: 'All Specimens', sort_order: 0 },
    ...categories,
  ];

  return (
    <div className="sticky top-[58px] z-30 bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] py-3 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {allCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer z-10 ${
                  isSelected
                    ? 'text-[var(--on-primary)]'
                    : 'text-[var(--ink)] bg-[var(--surface)] hover:text-[var(--primary)] border border-[var(--border)]'
                }`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryIndicator"
                    className="absolute inset-0 bg-[var(--primary)] border border-[var(--ink)] rounded-full -z-10 shadow-stamp"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
