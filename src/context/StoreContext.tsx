'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color?: string;
  quantity: number;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: any, size?: string, color?: string, qty?: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('wbk_cart');
      const savedWishlist = localStorage.getItem('wbk_wishlist');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error('Failed to parse local storage cart/wishlist:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('wbk_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to local storage:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('wbk_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to local storage:', e);
    }
  }, [wishlist]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: any, size = '0-3M', color?: string, qty = 1) => {
    const selectedColor =
      color || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const productId = String(product.id || product.slug);
    const itemSize = size || '0-3M';
    const parsedQty = Math.max(1, Number(qty) || 1);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          String(item.id) === productId &&
          String(item.size || '') === String(itemSize) &&
          String(item.color || '') === String(selectedColor || '')
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (Number(updated[existingIndex].quantity) || 0) + parsedQty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: productId,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image || (product.images && product.images[0]) || '',
          size: itemSize,
          color: selectedColor,
          quantity: parsedQty,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter((item) => {
        const idMatches = String(item.id) === String(id);
        const sizeMatches = size !== undefined ? String(item.size || '') === String(size || '') : true;
        const colorMatches = color !== undefined ? String(item.color || '') === String(color || '') : true;
        return !(idMatches && sizeMatches && colorMatches);
      })
    );
  };

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    const targetQty = Number(quantity);

    if (isNaN(targetQty) || targetQty <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        const idMatches = String(item.id) === String(id);
        const sizeMatches = size !== undefined ? String(item.size || '') === String(size || '') : true;
        const colorMatches = color !== undefined ? String(item.color || '') === String(color || '') : true;

        if (idMatches && sizeMatches && colorMatches) {
          return { ...item, quantity: targetQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    const pId = String(productId);
    setWishlist((prev) =>
      prev.includes(pId) ? prev.filter((id) => id !== pId) : [...prev, pId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(String(productId));

  const cartCount = cart.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
  const cartTotal = cart.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0),
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};