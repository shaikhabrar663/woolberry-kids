"use client";

import React from "react";
import Link from "next/link";
import { StoreProvider, useStore } from "../../context/StoreContext";
import CartDrawer from "../../components/CartDrawer";
import WhatsAppSupport from "../../components/WhatsAppSupport";

function StorefrontNavbar() {
  const { openCart, cartCount, wishlist } = useStore();

  return (
    <header className="w-full bg-white border-b border-[#F4EBE1] relative z-30 antialiased">
      {/* Promo Bar */}
      <div className="bg-[#E11D48] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest py-2 px-4 text-center">
        Free Shipping Above Rs. 999 • 100% Zero-Itch Baby Wool • Free Gift Box
        on Rs. 1999+
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer z-10"
        >
          <span className="w-9 h-9 rounded-full bg-[#E11D48] text-white flex items-center justify-center font-black text-sm group-hover:scale-105 transition pointer-events-none">
            w
          </span>
          <div className="flex flex-col justify-center pointer-events-none">
            <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#2D221C] leading-none mb-1">
              woolberry
            </span>
            <span className="text-[9px] font-bold tracking-wider uppercase text-[#8C7B71] leading-none">
              Kids & Gifts
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#2D221C]">
          <Link
            href="/collections/sweaters"
            className="hover:text-[#E11D48] transition"
          >
            Sweaters & Dresses
          </Link>
          <Link
            href="/collections/cardigans"
            className="hover:text-[#E11D48] transition"
          >
            Cardigans
          </Link>
          <Link
            href="/collections/gift-sets"
            className="hover:text-[#E11D48] transition"
          >
            Gift Sets
          </Link>
          <Link href="/size-guide" className="hover:text-[#E11D48] transition">
            Size Guide
          </Link>
          <Link href="/account" className="hover:text-[#E11D48] transition">
            My Orders
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="w-10 h-10 rounded-full bg-[#FAF5EE] hover:bg-[#F4EBE1] flex items-center justify-center text-[#2D221C] relative transition cursor-pointer"
            title="My Saved Favorites"
          >
            <svg
              className="w-4 h-4 text-[#2D221C]"
              fill={wishlist.length > 0 ? "#E11D48" : "none"}
              stroke={wishlist.length > 0 ? "#E11D48" : "currentColor"}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E11D48] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Drawer Trigger */}
          <button
            onClick={openCart}
            className="w-10 h-10 rounded-full bg-[#2D221C] hover:bg-[#E11D48] flex items-center justify-center text-white relative transition cursor-pointer shadow-xs"
            title="Open Bag"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E11D48] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function StorefrontFooter() {
  return (
    <footer className="bg-[#2D221C] text-[#FAF5EE] pt-12 pb-8 border-t border-black/10 mt-auto antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10 text-xs">
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-white">
              Woolberry Kids
            </h3>
            <p className="text-white/70 text-[11px] leading-relaxed">
              Ultra-soft organic merino wool & artisan-crocheted apparel
              designed for newborn to 5-year-old gentle comfort.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link
                  href="/collections/sweaters"
                  className="hover:text-white transition"
                >
                  Warm Sweaters
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/cardigans"
                  className="hover:text-white transition"
                >
                  Crochet Cardigans
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/gift-sets"
                  className="hover:text-white transition"
                >
                  Heirloom Gift Sets
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="/account" className="hover:text-white transition">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/size-guide"
                  className="hover:text-white transition"
                >
                  Baby Size Guide
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@woolberrykids.com"
                  className="hover:text-white transition"
                >
                  Help & Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Direct Support
            </h4>
            <p className="text-white/70 text-[11px] mb-2">
              WhatsApp / Email dispatch assistance:
            </p>
            <a
              href="mailto:support@woolberrykids.com"
              className="text-[#E11D48] font-bold text-xs hover:underline block"
            >
              support@woolberrykids.com
            </a>
          </div>
        </div>
        <div className="pt-6 text-center text-[10px] text-white/50">
          © 2026 Woolberry Kids. Crafted with care for little ones.
        </div>
      </div>
    </footer>
  );
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2D221C]">
        <StorefrontNavbar />
        <main className="flex-1 w-full">{children}</main>
        <StorefrontFooter />
        <CartDrawer />
        <WhatsAppSupport />
      </div>
    </StoreProvider>
  );
}
