import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, Option } from '../lib/database.types';

export interface CartLineOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDeltaPaise: number;
}

export interface CartLineItem {
  id: string; // unique hash of productId + options
  productId: string;
  productSlug: string;
  productName: string;
  categorySlug: string;
  imagePath: string;
  basePricePaise: number;
  unitPricePaise: number;
  quantity: number;
  lineTotalPaise: number;
  prepMinutes: number;
  options: CartLineOption[];
}

interface CartContextType {
  items: CartLineItem[];
  addItem: (product: Product, selectedOptions?: Option[], quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  subtotalPaise: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartLineItem[]>(() => {
    try {
      const saved = localStorage.getItem('cw.cart.v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(item => item && typeof item.id === 'string' && Array.isArray(item.options) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20 && Number.isFinite(item.unitPricePaise) && item.lineTotalPaise === item.unitPricePaise * item.quantity)) return parsed;
      }
    } catch {
      // Storage may be unavailable in private browsing.
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('cw.cart.v1', JSON.stringify(items)); } catch { /* Keep the in-memory bag usable. */ }
  }, [items]);

  const addItem = (product: Product, selectedOptions: Option[] = [], quantity: number = 1) => {
    const qty = Math.min(Math.max(1, quantity), 20);

    // Calculate unit price from base + deltas
    const deltas = selectedOptions.reduce((acc, opt) => acc + opt.priceDeltaPaise, 0);
    const unitPricePaise = product.basePricePaise + deltas;

    // Generate unique composite line ID based on product and sorted option IDs
    const optIds = selectedOptions.map((o) => o.id).sort().join('-');
    const lineId = `${product.id}_${optIds}`;

    // Map options
    const mappedOptions: CartLineOption[] = selectedOptions.map((opt) => {
      const group = product.optionGroups?.find((g) => g.options.some((o) => o.id === opt.id));
      return {
        groupId: opt.groupId,
        groupName: group?.name || 'Option',
        optionId: opt.id,
        optionName: opt.name,
        priceDeltaPaise: opt.priceDeltaPaise,
      };
    });

    setItems((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, 20);
        return prev.map((item) =>
          item.id === lineId
            ? {
                ...item,
                quantity: newQty,
                lineTotalPaise: item.unitPricePaise * newQty,
              }
            : item
        );
      }

      const newLine: CartLineItem = {
        id: lineId,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        categorySlug: product.categorySlug,
        imagePath: product.imagePath,
        basePricePaise: product.basePricePaise,
        unitPricePaise,
        quantity: qty,
        lineTotalPaise: unitPricePaise * qty,
        prepMinutes: product.prepMinutes,
        options: mappedOptions,
      };

      return [...prev, newLine];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }
    const clampedQty = Math.min(quantity, 20);
    setItems((prev) =>
      prev.map((item) =>
        item.id === lineId
          ? {
              ...item,
              quantity: clampedQty,
              lineTotalPaise: item.unitPricePaise * clampedQty,
            }
          : item
      )
    );
  };

  const removeItem = (lineId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== lineId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotalPaise = items.reduce((acc, item) => acc + item.lineTotalPaise, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotalPaise,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
