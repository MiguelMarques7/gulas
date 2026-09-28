'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/restaurant';
import { formatCurrency } from '@/data/mockRestaurant';
import { useCart } from '@/context/CartContext';
import { Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { clsx } from 'clsx';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { items, addItem, updateQuantity } = useCart();

  const cartItem = items.find((item) => item.product.id === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.available) return;
    addItem(product, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, currentQuantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(product.id, currentQuantity - 1);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className={clsx(
        'group relative flex flex-col justify-between rounded-2xl bg-white border border-zinc-200/80 p-3.5 sm:p-4 transition-all duration-200 hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-200/50 cursor-pointer select-none active:scale-[0.99]',
        !product.available && 'opacity-60 bg-zinc-50'
      )}
    >
      <div className="flex gap-3 sm:gap-4 items-start">
        {/* Text details */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Badges & Meta */}
          {((product.badges && product.badges.length > 0) || product.unitQuantity || !product.available) && (
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              {product.badges?.map((badgeKey) => (
                <Badge key={badgeKey} badgeType={badgeKey} size="sm" />
              ))}
              {product.unitQuantity && (
                <span className="text-[10px] text-zinc-500 font-semibold px-1.5 py-0.5 rounded bg-zinc-100">
                  {product.unitQuantity}
                </span>
              )}
              {!product.available && (
                <span className="text-[10px] text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-bold">
                  Esgotado
                </span>
              )}
            </div>
          )}

          <h3 className="text-sm sm:text-base font-bold text-[#141619] group-hover:text-[#15803D] transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 font-normal line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {product.includesNotes && (
            <p className="text-[11px] text-[#15803D] font-medium pt-0.5">
              {product.includesNotes}
            </p>
          )}
        </div>

        {/* Product image (if available) */}
        {product.imageUrl && (
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className={clsx(
                'object-cover transition-transform duration-300 group-hover:scale-105',
                !product.available && 'grayscale'
              )}
            />
          </div>
        )}
      </div>

      {/* Footer: Price and Add button */}
      <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-sm sm:text-base font-black text-[#141619] tracking-tight">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Add or Counter action */}
        {product.available ? (
          currentQuantity > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-zinc-100 rounded-full p-0.5 border border-zinc-200"
            >
              <button
                onClick={handleDecrement}
                className="w-6 h-6 rounded-full bg-white text-zinc-700 hover:bg-zinc-200 flex items-center justify-center transition-colors active:scale-90 shadow-2xs cursor-pointer"
                aria-label="Diminuir quantidade"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-[#141619] w-4 text-center">
                {currentQuantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 rounded-full bg-[#15803D] text-white hover:bg-[#166534] flex items-center justify-center font-bold transition-colors active:scale-90 shadow-2xs cursor-pointer"
                aria-label="Aumentar quantidade"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleQuickAdd}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#15803D] hover:bg-[#166534] text-white flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
              aria-label={`Adicionar ${product.name}`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          )
        ) : (
          <span className="text-xs text-zinc-400 font-medium italic">Indisponível</span>
        )}
      </div>
    </div>
  );
};
