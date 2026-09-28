'use client';

import React, { useRef } from 'react';
import { Category } from '@/types/restaurant';
import { clsx } from 'clsx';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
    const element = document.getElementById(`section-${categoryId}`);
    if (element) {
      const yOffset = -90; // height of sticky nav
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-zinc-200/80 py-2.5 transition-all">
      <div className="max-w-4xl mx-auto px-4">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categories.map((category) => {
            const isActive = activeCategoryId === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={clsx(
                  'whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95 border',
                  isActive
                    ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                    : 'bg-white text-[#141619] border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50'
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
