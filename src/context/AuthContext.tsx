import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item } from '@/data/items';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  item: Item;
  quantity: number;
  totalPrice: number;
  bookedAt: string;
  paymentMethod: string;
}

interface AuthContextType {
  user: User | null;
  bookings: Booking[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'bookedAt'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('bmp_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      const savedBookings = localStorage.getItem(`bmp_bookings_${u.id}`);
      if (savedBookings) setBookings(JSON.parse(savedBookings));
    }
  }, []);

  const signup = (name: string, email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('bmp_users') || '[]');
    if (users.find((u: any) => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    localStorage.setItem('bmp_users', JSON.stringify(users));
    const { password: _, ...userWithoutPass } = newUser;
    setUser(userWithoutPass);
    localStorage.setItem('bmp_user', JSON.stringify(userWithoutPass));
    return true;
  };

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('bmp_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (!found) return false;
    const { password: _, ...userWithoutPass } = found;
    setUser(userWithoutPass);
    localStorage.setItem('bmp_user', JSON.stringify(userWithoutPass));
    const savedBookings = localStorage.getItem(`bmp_bookings_${found.id}`);
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    else setBookings([]);
    return true;
  };

  const logout = () => {
    setUser(null);
    setBookings([]);
    localStorage.removeItem('bmp_user');
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'bookedAt'>) => {
    const newBooking: Booking = { ...booking, id: crypto.randomUUID(), bookedAt: new Date().toISOString() };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    if (user) localStorage.setItem(`bmp_bookings_${user.id}`, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, bookings, login, signup, logout, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
