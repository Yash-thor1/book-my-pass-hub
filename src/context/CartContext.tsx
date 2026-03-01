import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Item } from '@/data/items';

export interface CartItem {
  item: Item;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Item, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + quantity } : c);
      return [...prev, { item, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => setCart(prev => prev.filter(c => c.item.id !== itemId));
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(itemId);
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity } : c));
  };
  const clearCart = () => setCart([]);
  const totalItems = cart.reduce((acc, c) => acc + c.quantity, 0);
  const totalPrice = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
