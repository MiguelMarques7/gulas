'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product, CartItem, Order, OrderStatus } from '@/types/restaurant';
import { mockRestaurant } from '@/data/mockRestaurant';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedTableNumber: number | null;
  setSelectedTableNumber: (tableNumber: number | null) => void;
  isTableLocked: boolean;
  setIsTableLocked: (locked: boolean) => void;
  submitOrder: (customerNotes?: string) => Promise<Order>;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  isOrderSuccessModalOpen: boolean;
  setIsOrderSuccessModalOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'gulas_cart_state_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(4); // Default to table 4 for easy testing
  const [isTableLocked, setIsTableLocked] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isOrderSuccessModalOpen, setIsOrderSuccessModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from session/localStorage once client is mounted
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) {
          setItems(parsed.items);
        }
        if (typeof parsed.selectedTableNumber === 'number') {
          setSelectedTableNumber(parsed.selectedTableNumber);
        }
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items,
          selectedTableNumber,
        })
      );
    } catch {
      // ignore
    }
  }, [items, selectedTableNumber]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const addItem = (product: Product, quantity = 1, notes?: string) => {
    if (!product.available) {
      showToast('Este artigo encontra-se indisponível de momento.');
      return;
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const currentItem = updated[existingIndex];
        updated[existingIndex] = {
          ...currentItem,
          quantity: currentItem.quantity + quantity,
          notes: notes !== undefined ? notes : currentItem.notes,
        };
        return updated;
      } else {
        return [...prev, { product, quantity, notes }];
      }
    });

    showToast(`Adicionado: ${product.name}`);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const updateNotes = (productId: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, notes } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const total = subtotal;

  const submitOrder = async (customerNotes?: string): Promise<Order> => {
    if (items.length === 0) {
      throw new Error('O carrinho está vazio');
    }
    if (!selectedTableNumber) {
      throw new Error('Por favor selecione o número da mesa');
    }

    // In this first milestone, we generate a client-simulated order and trigger the confirmation
    const orderNumber = Math.floor(100 + Math.random() * 900);
    const newOrder: Order = {
      id: `ord_${orderNumber}`,
      restaurantId: mockRestaurant.id,
      tableNumber: selectedTableNumber,
      tableName: `Mesa ${selectedTableNumber}`,
      items: [...items],
      subtotal,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customerNotes,
    };

    setActiveOrder(newOrder);
    setIsOrderSuccessModalOpen(true);
    setIsCartOpen(false);
    clearCart();

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        itemCount,
        subtotal,
        total,
        isCartOpen,
        setIsCartOpen,
        selectedTableNumber,
        setSelectedTableNumber,
        isTableLocked,
        setIsTableLocked,
        submitOrder,
        activeOrder,
        setActiveOrder,
        isOrderSuccessModalOpen,
        setIsOrderSuccessModalOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
