'use client';

import React from 'react';
import Link from 'next/link';
import { CartProvider, useCart } from '@/context/CartContext';

function Drawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const diff = freeShippingThreshold - subtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          <div className="p-6 border-b border-[#F4EBE1]">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-[#2D221C]">
                Your Shopping Bag ({totalItems})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#78675E] hover:text-[#E11D48] transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 bg-[#FAF5EE] p-3 rounded-2xl border border-[#EBE2D5]">
              <p className="text-[11px] font-bold text-[#2D221C] mb-1.5">
                {diff > 0 ? (
                  <>Add <span className="text-[#E11D48]">Rs. {diff.toLocaleString('en-IN')}</span> more for FREE Express Shipping!</>
                ) : (
                  <span className="text-emerald-700">🎉 You unlocked FREE Express Shipping!</span>
                )}
              </p>
              <div className="w-full bg-[#E5DDD2] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#F43F5E] to-[#F59E0B] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-4xl block mb-2">🧸</span>
                <p className="font-heading text-lg font-bold text-[#2D221C]">Your cart is empty</p>
                <p className="text-xs text-[#78675E] mt-1">Discover handcrafted cozy layers for your baby.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-block bg-[#2D221C] text-white text-xs uppercase font-extrabold px-6 py-3 rounded-xl hover:bg-[#E11D48] transition cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 p-3 bg-[#FFFDF9] rounded-2xl border border-[#F4EBE1]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading text-xs font-bold text-[#2D221C] line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-[#9C8B80] hover:text-[#E11D48] text-xs font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF5EE] text-[#5C4D44] border border-[#EBE2D5]">
                        Size: {item.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-heading font-extrabold text-xs text-[#2D221C]">
                        Rs. {(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center border border-[#EBE2D5] rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#78675E] hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#2D221C]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#78675E] hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-[#F4EBE1] bg-[#FFFDF9] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#78675E] font-medium">Subtotal</span>
                <span className="font-heading text-lg font-bold text-[#2D221C]">
                  Rs. {subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-[#8C7B71]">Taxes and shipping calculated at checkout.</p>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-[#2D221C] text-white py-4 rounded-2xl text-xs uppercase font-extrabold tracking-widest text-center block hover:bg-[#E11D48] transition shadow-md"
              >
                Proceed to Checkout →
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Drawer />
    </CartProvider>
  );
}
