'use client';

import React from 'react';
import { Search, X, Flame, Sparkles, Leaf, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export type MenuFilterType = 'all' | 'especialidade' | 'novidade' | 'picante' | 'vegetariano';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: MenuFilterType;
  onFilterChange: (filter: MenuFilterType) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-2 space-y-2">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Procurar no menu..."
          className="w-full pl-10 pr-8 py-2 bg-white border border-zinc-200/90 rounded-xl text-xs sm:text-sm text-[#141619] placeholder-zinc-400 focus:outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D]/20 transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => onFilterChange('all')}
          className={clsx(
            'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border',
            activeFilter === 'all'
              ? 'bg-[#141619] text-white border-[#141619]'
              : 'text-zinc-600 bg-white border-zinc-200/80 hover:bg-zinc-50'
          )}
        >
          Todos
        </button>

        <button
          onClick={() => onFilterChange('especialidade')}
          className={clsx(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border',
            activeFilter === 'especialidade'
              ? 'bg-[#15803D] text-white border-[#15803D]'
              : 'text-zinc-600 bg-white border-zinc-200/80 hover:bg-zinc-50'
          )}
        >
          <Sparkles className="w-3 h-3" />
          Especialidades
        </button>

        <button
          onClick={() => onFilterChange('novidade')}
          className={clsx(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border',
            activeFilter === 'novidade'
              ? 'bg-[#15803D] text-white border-[#15803D]'
              : 'text-zinc-600 bg-white border-zinc-200/80 hover:bg-zinc-50'
          )}
        >
          <Zap className="w-3 h-3" />
          Novidades
        </button>

        <button
          onClick={() => onFilterChange('picante')}
          className={clsx(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border',
            activeFilter === 'picante'
              ? 'bg-red-700 text-white border-red-700'
              : 'text-zinc-600 bg-white border-zinc-200/80 hover:bg-zinc-50'
          )}
        >
          <span className="text-[10px]">🌶️</span>
          Picantes
        </button>

        <button
          onClick={() => onFilterChange('vegetariano')}
          className={clsx(
            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer border',
            activeFilter === 'vegetariano'
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'text-zinc-600 bg-white border-zinc-200/80 hover:bg-zinc-50'
          )}
        >
          <Leaf className="w-3 h-3" />
          Vegetarianos
        </button>
      </div>
    </div>
  );
};
