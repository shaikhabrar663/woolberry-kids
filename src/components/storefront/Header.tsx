'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export default function Header() {
  const { cartCount, openCart } = useStore();
  const [guestEmail, setGuestEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const email = localStorage.getItem('wbk_customer_email');
      if (email) setGuestEmail(email);
    } catch (e) {
      console.error('Error reading localStorage for customer email:', e);
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#F4EBE1] antialiased">
      {/* Top Announcement Strip */}
      <div className="bg-[#2D221C] text-[#FAF5EE] text-[10px] sm:text-xs font-bold py-1.5 px-4 text-center">
        <span>Handcrafted with 100% Organic Merino Wool • Free Shipping above Rs. 999</span>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-[#2D221C] text-[#FAF5EE] flex items-center justify-center font-black text-sm">
            W
          </span>
          <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#2D221C]">
            Woolberry Kids
          </span>
        </Link>

        {/* Center Category Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#5C4D44]">
          <Link href="/collections/all" className="hover:text-[#E11D48] transition">
            Shop All
          </Link>
          <Link href="/collections/0-3m" className="hover:text-[#E11D48] transition">
            Newborn (0-3M)
          </Link>
          <Link href="/collections/3-6m" className="hover:text-[#E11D48] transition">
            Baby (3-6M)
          </Link>
          <Link href="/collections/gift-sets" className="hover:text-[#E11D48] transition">
            Gift Sets
          </Link>
        </nav>

        {/* Right Actions: Guest Orders Portal + Bag Drawer */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-bold text-[#2D221C]">
          <Link
            href="/account"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EBE2D5] bg-[#FAF5EE] hover:bg-[#F4EBE1] text-[#2D221C] transition cursor-pointer"
            title={guestEmail ? `Signed in as ${guestEmail}` : 'Track Orders'}
          >
            <span>👤</span>
            <span className="hidden sm:inline">{guestEmail ? 'My Orders' : 'Guest Sign In'}</span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2D221C] hover:bg-[#E11D48] text-white transition cursor-pointer shadow-2xs"
          >
            <span>🛍️</span>
            <span>Bag</span>
            <span className="bg-[#E11D48] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}