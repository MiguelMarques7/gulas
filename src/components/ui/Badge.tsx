import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles, Leaf } from 'lucide-react';
import { ProductBadge } from '@/types/restaurant';

interface BadgeProps {
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'popular'
    | 'chef'
    | 'success'
    | 'danger'
    | 'warning'
    | 'muted'
    | 'picante'
    | 'vegetariano'
    | 'vegan'
    | 'especialidade'
    | 'novidade'
    | 'house_special';
  badgeType?: ProductBadge;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  badgeType,
  className,
  size = 'sm',
}) => {
  const effectiveVariant = variant || (badgeType as string) || 'secondary';

  const baseStyles =
    'inline-flex items-center gap-1 font-semibold rounded-md tracking-tight transition-colors';

  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-xs px-2 py-0.5 leading-tight',
  };

  const variantStyles: Record<string, string> = {
    novidade:
      'bg-[#15803D] text-white font-bold tracking-wide uppercase',
    picante:
      'bg-red-50 text-red-700 border border-red-200/80',
    vegetariano:
      'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    vegan:
      'bg-teal-50 text-teal-800 border border-teal-200/80',
    especialidade:
      'bg-emerald-900/5 text-[#15803D] border border-emerald-700/20 font-bold',
    house_special:
      'bg-emerald-900/5 text-[#15803D] border border-emerald-700/20 font-bold',
    popular:
      'bg-amber-50 text-amber-900 border border-amber-200/80 font-medium',
    primary:
      'bg-emerald-50 text-emerald-800 border border-emerald-200',
    secondary:
      'bg-zinc-100 text-zinc-700 border border-zinc-200/80',
    muted:
      'bg-zinc-100 text-zinc-500',
  };

  const renderDefaultIcon = () => {
    switch (effectiveVariant) {
      case 'picante':
        return <span className="text-[10px] leading-none" aria-hidden="true">🌶️</span>;
      case 'vegetariano':
        return <Leaf className="w-2.5 h-2.5 text-emerald-700" />;
      case 'vegan':
        return <Leaf className="w-2.5 h-2.5 text-teal-700" />;
      case 'especialidade':
      case 'house_special':
        return <Sparkles className="w-2.5 h-2.5 text-[#15803D]" />;
      default:
        return null;
    }
  };

  const renderDefaultLabel = () => {
    switch (effectiveVariant) {
      case 'novidade':
        return 'NOVIDADE';
      case 'picante':
        return 'Picante';
      case 'vegetariano':
        return 'Vegetariano';
      case 'vegan':
        return 'Vegan';
      case 'especialidade':
        return 'Especialidade';
      case 'house_special':
        return 'Especial Gulas';
      case 'popular':
        return 'Popular';
      default:
        return null;
    }
  };

  return (
    <span
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[effectiveVariant] || variantStyles.secondary, className)
      )}
    >
      {renderDefaultIcon()}
      {children || renderDefaultLabel()}
    </span>
  );
};
